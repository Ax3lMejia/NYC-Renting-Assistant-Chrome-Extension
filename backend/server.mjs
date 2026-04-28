import { createServer } from 'node:http';
import { URL } from 'node:url';

const PORT = Number(process.env.PORT || 8787);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 15 * 60 * 1000);
const NYC_OPEN_DATA_DOMAIN = 'data.cityofnewyork.us';

const ENDPOINTS = {
  hpdViolations: 'https://data.cityofnewyork.us/resource/wvxf-7kdb.json',
  complaints311: 'https://data.cityofnewyork.us/resource/erm2-nwe9.json',
};

const cache = new Map();

class RateLimiter {
  static queues = new Map();
  static processing = new Map();

  static async enqueue(domain, requestFn) {
    return new Promise((resolve, reject) => {
      if (!this.queues.has(domain)) {
        this.queues.set(domain, []);
      }

      const queue = this.queues.get(domain);

      const executeRequest = async () => {
        let retries = 0;
        const maxRetries = 3;
        let delayMs = 1000;

        while (retries <= maxRetries) {
          try {
            const result = await requestFn();
            resolve(result);
            this.processNext(domain);
            return;
          } catch (error) {
            if (error?.status === 429 && retries < maxRetries) {
              await new Promise(res => setTimeout(res, delayMs));
              delayMs *= 2;
              retries++;
            } else {
              reject(error);
              this.processNext(domain);
              return;
            }
          }
        }
      };

      queue.push(executeRequest);
      this.processNext(domain);
    });
  }

  static processNext(domain) {
    if (this.processing.get(domain)) {
      return;
    }

    const queue = this.queues.get(domain);
    if (!queue || queue.length === 0) {
      this.processing.set(domain, false);
      return;
    }

    this.processing.set(domain, true);
    const nextRequest = queue.shift();

    setTimeout(() => {
      nextRequest?.();
      this.processing.set(domain, false);
    }, 250);
  }
}

function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(response, statusCode, payload) {
  setCorsHeaders(response);
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function createEmptyBuildingData(address) {
  return {
    address,
    bbl: null,
    complaints: null,
    complaintSeverity: null,
    violations: null,
    dobViolations: null,
    bedbugReports: null,
    rodentInspections: null,
    rodentFailures: null,
    rentEstimate: null,
    lastUpdated: Date.now(),
  };
}

function parseAddressComponents(address) {
  const stripped = address
    .replace(/,?\s*(apt\.?|apartment|unit|#|ste\.?|suite|fl\.?|floor)\s*[^,]*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const parts = stripped.split(',').map(part => part.trim()).filter(Boolean);
  const streetMatch = parts[0]?.match(/^(\d+(?:-\d+)?)\s+(.+)/);
  if (!streetMatch) return null;

  const houseNumber = streetMatch[1].trim();
  const street = streetMatch[2].trim();

  return {
    houseNumber,
    street,
    normalizedAddress: `${houseNumber} ${street}`.toUpperCase(),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP error ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

async function fetchCount(url) {
  const data = await RateLimiter.enqueue(NYC_OPEN_DATA_DOMAIN, () => fetchJson(url));
  const count = Number(Array.isArray(data) ? data[0]?.count : NaN);

  if (!Number.isFinite(count)) {
    throw new Error('Unexpected count response from NYC Open Data.');
  }

  return count;
}

function calculateSeverity(count) {
  if (count < 5) return 'low';
  if (count < 15) return 'medium';
  return 'high';
}

function getCachedEntry(address) {
  const key = address.toLowerCase().trim();
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return cached.payload;
}

function setCachedEntry(address, payload) {
  const key = address.toLowerCase().trim();
  cache.set(key, {
    timestamp: Date.now(),
    payload,
  });
}

async function buildInsights(address) {
  const parsed = parseAddressComponents(address);
  const data = createEmptyBuildingData(address);
  const errors = [];

  if (!parsed) {
    return {
      address,
      normalizedAddress: address,
      data,
      errors: [{ source: 'Address Parser', message: 'Could not parse the address into house number and street name.' }],
    };
  }

  const hpdParams = new URLSearchParams({
    housenumber: parsed.houseNumber,
    streetname: parsed.street,
    '$where': "violationstatus='Open'",
    '$select': 'count(*)',
  });

  const complaintsParams = new URLSearchParams({
    incident_address: `${parsed.houseNumber} ${parsed.street}`,
    '$select': 'count(*)',
  });

  const [violationsResult, complaintsResult] = await Promise.allSettled([
    fetchCount(`${ENDPOINTS.hpdViolations}?${hpdParams}`),
    fetchCount(`${ENDPOINTS.complaints311}?${complaintsParams}`),
  ]);

  if (violationsResult.status === 'fulfilled') {
    data.violations = violationsResult.value;
  } else {
    errors.push({
      source: 'HPD Open Violations',
      message: violationsResult.reason?.message || 'Failed to fetch HPD open violations.',
    });
  }

  if (complaintsResult.status === 'fulfilled') {
    data.complaints = complaintsResult.value;
    data.complaintSeverity = calculateSeverity(complaintsResult.value);
  } else {
    errors.push({
      source: '311 Complaints',
      message: complaintsResult.reason?.message || 'Failed to fetch 311 complaint counts.',
    });
  }

  data.lastUpdated = Date.now();

  return {
    address,
    normalizedAddress: parsed.normalizedAddress,
    data,
    errors,
  };
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

const server = createServer(async (request, response) => {
  setCorsHeaders(response);

  if (!request.url || !request.method) {
    sendJson(response, 400, { error: 'Invalid request.' });
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'GET' && url.pathname === '/health') {
    sendJson(response, 200, {
      ok: true,
      service: 'nyc-renting-assistant-backend',
      uptimeSeconds: Math.round(process.uptime()),
      cacheEntries: cache.size,
    });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/building-insights') {
    try {
      const body = await readJsonBody(request);
      const address = typeof body.address === 'string' ? body.address.trim() : '';

      if (!address) {
        sendJson(response, 400, { error: 'Address is required.' });
        return;
      }

      const cached = getCachedEntry(address);
      if (cached) {
        sendJson(response, 200, cached);
        return;
      }

      const payload = await buildInsights(address);
      setCachedEntry(address, payload);
      sendJson(response, 200, payload);
      return;
    } catch (error) {
      sendJson(response, 500, {
        error: error?.message || 'Failed to build insights.',
      });
      return;
    }
  }

  sendJson(response, 404, { error: 'Not found.' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`NYC Renting Assistant backend listening on http://127.0.0.1:${PORT}`);
});
