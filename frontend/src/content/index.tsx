import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { ErrorBoundary } from '../components/ErrorBoundary';
import cssText from '../globals.css?inline';
import { getZillowAddress, isZillowListingPage } from './selectors/zillow-selector';
import { getStreetEasyAddress, isStreetEasyListingPage } from './selectors/streeteasy-selector';

const rootId = 'nyc-renting-assistant-root';

function detectAddress(): string | null {
  if (window.location.hostname.includes('zillow.com') && isZillowListingPage()) {
    return getZillowAddress();
  }

  if (window.location.hostname.includes('streeteasy.com') && isStreetEasyListingPage()) {
    return getStreetEasyAddress();
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
  container.style.pointerEvents = 'none';

  const shadowRoot = container.attachShadow({ mode: 'open' });
  const shadowWrapper = document.createElement('div');
  shadowWrapper.id = 'shadow-wrapper';
  shadowWrapper.className = 'nyc-raw-wrapper';
  shadowWrapper.style.pointerEvents = 'none';
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

  if (import.meta.env.DEV) {
    console.log('Scraped address:', currentAddress);
  }

  root.render(
    <React.StrictMode>
      <ErrorBoundary context={currentAddress}>
        <App scrapedAddress={currentAddress} />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

function watchForPageChanges() {
  let debounceTimeout: any = null;

  const checkAndUpdate = () => {
    const newAddress = detectAddress();
    if (newAddress !== currentAddress) {
      currentAddress = newAddress;
      if (root) {
        root.render(
          <React.StrictMode>
            <ErrorBoundary context={currentAddress}>
              <App scrapedAddress={currentAddress} />
            </ErrorBoundary>
          </React.StrictMode>
        );
      }
    }
  };

  const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(checkAndUpdate, 500);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // fallback polling for SPA routing
  setInterval(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      checkAndUpdate();
    }
  }, 1000);
}

const supportedDomains = ['zillow.com', 'streeteasy.com', 'apartments.com'];

if (supportedDomains.some(domain => window.location.hostname.includes(domain))) {
  init();
  watchForPageChanges();
}
