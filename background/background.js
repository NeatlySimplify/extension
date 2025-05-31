const messageHandlers = {
  'SEND_TO_AI': async (message, sender, sendResponse) => {
    // Handle sending message to AI backend
    const reply = await sendToAiServer(message.text);
    sendResponse({ reply });
  },

  'GET_USER_SETTINGS': (message, sender, sendResponse) => {
    // Retrieve settings from storage
    chrome.storage.local.get(['settings'], (result) => {
      sendResponse({ settings: result.settings || {} });
    });
  },

  'SAVE_COOKIE': (message, sender, sendResponse) => {
    chrome.cookies.set({
      url: sender.url || 'http://localhost', // Adjust depending on context
      name: 'my_extension_cookie',
      value: msg.value,
      expirationDate: Date.now() / 1000 + 60 * 60 * 24 * 365 // 1 year
    }, (cookie) => {
      console.log('Cookie saved:', cookie);
      sendResponse({ status: 'saved' });
    });
    return true; // Keep message channel open for async response
  },
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handler = messageHandlers[message.type];
  if (handler) {
    const maybePromise = handler(message, sender, sendResponse);
    // If the handler returns a promise, keep listener alive
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.then(() => sendResponse()).catch(console.error);
      return true; // Indicates async response
    }
    return true; // If handler uses sendResponse async manually
  } else {
    console.warn('No handler for message type:', message.type);
  }
  return false; // No async response expected
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.startsWith('http')) {
    chrome.cookies.get({ url: tab.url, name: 'my_extension_cookie' }, (cookie) => {
      if (!cookie) {
        // Tell content.js to show the Vue form
        chrome.tabs.sendMessage(tabId, { type: 'SHOW_VUE_FORM' });
      } else {
        // Proceed normally
        console.log('Cookie found:', cookie.value);
      }
    });
  }
});
