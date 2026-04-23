chrome.runtime.onInstalled.addListener(() => {
  console.log('NYC Renting Assistant extension installed.');
});

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.type === 'GET_BUILDING_DATA') {
    // Placeholder for API logic
    sendResponse({ status: 'success', data: { message: 'Data for ' + request.address } });
  }
  
  return true; // Keep channel open for async response
});
