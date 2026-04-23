export const isPopup = () => {
  return typeof chrome !== 'undefined' && 
         chrome.extension && 
         chrome.extension.getBackgroundPage && 
         chrome.extension.getBackgroundPage() === window;
};

// A simpler check for most cases
export const isExtensionPopup = () => {
  return window.location.protocol === 'chrome-extension:' && 
         !window.location.pathname.includes('background');
};
