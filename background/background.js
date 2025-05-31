

const messageHandlers = {
  'SEND_TO_AI': async (message, sender, sendResponse) => {
    // Handle sending message to AI backend
    const reply = await sendToAiServer(message.text);
    sendResponse({ reply });
  },

  'GET_USER_SETTINGS': (message, sender, sendResponse) => {
    // Retrieve settings from storage
    chrome.storage.local.get(['GuIA'], (result) => {
      sendResponse({ GuIA: result || {} });
    });
  },

  'SAVE_USER_SETTINGS': (message, sender, sendResponse) => {
    chrome.storage.local.set({ 'GuIA': message.data }, () => {
      console.log('Object saved to chrome.storage.local:', message.data);
      sendResponse({ status: 'saved' });
    });
    return true; // Keep message channel open for async response
  },

  'SEND_TO_GEMINI': async (message, sender, sendResponse) => {
    const model = message.model;
    const text = message.text;
    let response;

    if (model === 'gemini-pro') {
      response = await sendToGeminiPro(text);
    } else if (model === 'gemini-flash') {
      response = await sendToGeminiFlash(text);
    } else {
      response = { error: 'Invalid or missing Gemini model specified.' };
    }
    sendResponse(response);
  },
};


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

