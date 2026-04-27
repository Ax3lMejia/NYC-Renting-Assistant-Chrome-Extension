export class RateLimiter {
  private static queues: Map<string, Array<() => void>> = new Map();
  private static processing: Map<string, boolean> = new Map();

  static async enqueue<T>(domain: string, requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.queues.has(domain)) {
        this.queues.set(domain, []);
      }

      const queue = this.queues.get(domain)!;

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
          } catch (error: any) {
            if (error?.status === 429 && retries < maxRetries) {
              console.warn(`Rate limit hit for ${domain}. Retrying in ${delayMs}ms...`);
              await new Promise(res => setTimeout(res, delayMs));
              delayMs *= 2; // exponential backoff
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

  private static processNext(domain: string) {
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

    if (nextRequest) {
      // add a small artificial delay to respect generic rate limits (e.g. 5 req/sec = 200ms)
      setTimeout(() => {
        nextRequest();
        this.processing.set(domain, false);
      }, 250);
    } else {
      this.processing.set(domain, false);
    }
  }
}
