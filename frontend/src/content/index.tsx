import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import cssText from '../globals.css?inline';
import { getZillowAddress, isZillowListingPage, getZillowPrice } from './selectors/zillow-selector';
import { getStreetEasyAddress, isStreetEasyListingPage, getStreetEasyPrice } from './selectors/streeteasy-selector';
import { getApartmentsAddress, isApartmentsListingPage, getApartmentsPrice } from './selectors/apartments-selector';

const rootId = 'nyc-renting-assistant-root';

function detectAddress(): string | null {
  if (window.location.hostname.includes('zillow.com') && isZillowListingPage()) {
    return getZillowAddress();
  }
  if (window.location.hostname.includes('streeteasy.com') && isStreetEasyListingPage()) {
    return getStreetEasyAddress();
  }
  if (window.location.hostname.includes('apartments.com') && isApartmentsListingPage()) {
    return getApartmentsAddress();
  }
  return null;
}

function detectPrice(): number | null {
  if (window.location.hostname.includes('zillow.com') && isZillowListingPage()) {
    return getZillowPrice();
  }
  if (window.location.hostname.includes('streeteasy.com') && isStreetEasyListingPage()) {
    return getStreetEasyPrice();
  }
  if (window.location.hostname.includes('apartments.com') && isApartmentsListingPage()) {
    return getApartmentsPrice();
  }
  return null;
}

let currentAddress: string | null = null;
let currentUrl = window.location.href;
let root: ReactDOM.Root | null = null;
let shadowWrapperRef: HTMLDivElement | null = null;

function init() {
  const existingRoot = document.getElementById(rootId);
  if (existingRoot) return;

  const container = document.createElement('div');
  container.id = rootId;
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';

  const shadowRoot = container.attachShadow({ mode: 'open' });
  const shadowWrapper = document.createElement('div');
  shadowWrapper.id = 'shadow-wrapper';
  shadowWrapper.className = 'nyc-raw-wrapper';
  shadowRoot.appendChild(shadowWrapper);

  const styleElement = document.createElement('style');
  styleElement.textContent = cssText;
  shadowRoot.appendChild(styleElement);

  document.body.appendChild(container);

  shadowWrapperRef = shadowWrapper;
  root = ReactDOM.createRoot(shadowWrapper);
  renderApp();
}

function renderApp() {
  if (!root) return;

  currentAddress = detectAddress();
  const currentPrice = detectPrice();

  if (import.meta.env.DEV) {
    console.log('Scraped address:', currentAddress, 'price:', currentPrice);
  }

  root.render(
    <React.StrictMode>
      <App scrapedAddress={currentAddress} scrapedPrice={currentPrice} />
    </React.StrictMode>
  );
}

function watchForPageChanges() {
  let debounceTimeout: any = null;

  const checkAndUpdate = () => {
    // Re-init if SPA navigation removed our container from the DOM
    if (!document.getElementById(rootId)) {
      root = null;
      shadowWrapperRef = null;
      init();
    }

    const newAddress = detectAddress();
    if (newAddress !== currentAddress) {
      currentAddress = newAddress;
      if (root) {
        const currentPrice = detectPrice();
        root.render(
          <React.StrictMode>
            <App scrapedAddress={currentAddress} scrapedPrice={currentPrice} />
          </React.StrictMode>
        );
      }
    }
  };

  const onNavigate = () => {
    currentUrl = window.location.href;
    // Listing content loads async — retry at increasing intervals
    setTimeout(checkAndUpdate, 500);
    setTimeout(checkAndUpdate, 1500);
    setTimeout(checkAndUpdate, 3000);
    setTimeout(checkAndUpdate, 5000);
  };

  // Intercept pushState/replaceState for immediate SPA navigation detection
  const origPushState = history.pushState.bind(history);
  history.pushState = function (...args: Parameters<typeof history.pushState>) {
    origPushState(...args);
    onNavigate();
  };

  const origReplaceState = history.replaceState.bind(history);
  history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
    origReplaceState(...args);
    onNavigate();
  };

  window.addEventListener('popstate', onNavigate);

  const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(checkAndUpdate, 300);
  });

  // Observe documentElement so we catch body replacement during SPA navigation
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Poll on initial load — Zillow renders content via JS after DOMContentLoaded
  let initRetries = 0;
  const initPoll = setInterval(() => {
    if (initRetries++ >= 8 || currentAddress !== null) {
      clearInterval(initPoll);
      return;
    }
    checkAndUpdate();
  }, 500);
}

const supportedDomains = ['zillow.com', 'streeteasy.com', 'apartments.com'];

if (supportedDomains.some(domain => window.location.hostname.includes(domain))) {
  init();
  watchForPageChanges();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_CURRENT_ADDRESS') {
    sendResponse({ address: currentAddress });
  }
  return false;
});
