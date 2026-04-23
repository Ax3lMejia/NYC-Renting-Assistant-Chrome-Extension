import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import cssText from '../globals.css?inline';

const rootId = 'nyc-renting-assistant-root';

function init() {
  const existingRoot = document.getElementById(rootId);
  if (existingRoot) return;

  const container = document.createElement('div');
  container.id = rootId;

  // use Shadow DOM to isolate styles
  const shadowRoot = container.attachShadow({ mode: 'open' });
  const shadowWrapper = document.createElement('div');
  shadowWrapper.id = 'shadow-wrapper';
  shadowWrapper.className = 'nyc-ra-wrapper'; // useful for targeting
  shadowRoot.appendChild(shadowWrapper);

  const styleElement = document.createElement('style');
  styleElement.textContent = cssText;
  shadowRoot.appendChild(styleElement);

  document.body.appendChild(container);

  const root = ReactDOM.createRoot(shadowWrapper);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// only run on supported domains
const supportedDomains = ['zillow.com', 'streeteasy.com', 'apartments.com'];
if (supportedDomains.some(domain => window.location.hostname.includes(domain))) {
  init();
}
