import { MessageBroker } from './messageBroker';

chrome.runtime.onInstalled.addListener(() => {
  console.log('NYC Renting Assistant extension installed.');
});

// initialize the message broker to listen for content script requests
MessageBroker.init();
