# NYC Renting Assistant

## Overview
The NYC Renting Assistant is a browser extension designed to make apartment searching in New York City more efficient and informative for users. Many apartment listing platforms, such as StreetEasy and Zillow, do not provide sufficient details about building conditions, which forces users to spend additional time researching information such as complaints, violations, and pricing from multiple sources. This project aims to simplify that process by integrating relevant data directly into the listing experience.

The extension operates within the user's Chrome browser and activates automatically when a supported apartment listing is opened. It detects the property address on the page and retrieves additional information from public data sources, such as NYC Open Data APIs. This includes building complaint history, violation records, and rental price comparisons relative to the surrounding area.

The collected information is displayed in a sidebar panel alongside the listing, allowing users to quickly assess the quality and value of a property without leaving the page. By centralizing this information, the NYC Renting Assistant reduces the need for manual research and helps users make more informed decisions during their apartment search.

## Features
* **Automatic Address Detection:** Scans supported listing pages to identify the full street address.
* **Data Aggregation:** Gathers building complaints, HPD maintenance code violations, rodent or pest complaints, litigation history, average area rent, and sound or noise data.
* **Non-intrusive UI:** Displays aggregated information in an overlay or sidebar within the listing page.
* **User Configuration:** Allows users to toggle specific data categories on or off.
* **Source Attribution:** Provides links to the original sources for all displayed data.

## Architecture
* **Content Script:** A thin client that performs DOM reads and UI writes. It forwards data requests to the background service worker via Chrome runtime messaging.
* **Background Service Worker:** Acts as the API and cache layer. It handles rate limit management and caching, preventing IP level bans from NYC open data portals.
* **Local Storage:** Utilizes Chrome Local Storage for caching and saving user preferences, ensuring no user data is transmitted to third parties.
* **Manifest V3:** Built using Manifest V3 standards with an event driven service worker.

## Tech Stack
* **Frontend:** React, TypeScript, Tailwind CSS
* **Build Tool:** Vite with CRXJS plugin
* **APIs:** NYC Open Data, HPD

## Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* Google Chrome or a Chromium based browser

### Installation
1. Clone the repository.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
To run the extension in development mode with hot module replacement:
```bash
npm run dev
```
Then, load the unpacked extension in Chrome:
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the `frontend/dist` directory.

### Building for Production
To build the extension for production:
```bash
npm run build
```
The compiled files will be output to the `frontend/dist` directory, which can be zipped and uploaded to the Chrome Web Store.

## Team
* Andrew Li
* Nuzhat Khan
* Axel Mejia Lopez