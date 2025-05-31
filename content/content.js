if (!document.getElementById('focus-style')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('content/focus.css');
  link.id = 'focus-style';
  document.head.appendChild(link);
}

// Create overlay
const overlay = document.createElement('div');
overlay.className = 'focus-overlay';
document.body.appendChild(overlay);

// Highlight a specific element (example: first <button>)
const el = document.querySelector('button');
if (el) {
  el.classList.add('focus-ring');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SHOW_VUE_FORM') {
    injectVueForm();
    sendResponse({ status: 'injected' });
  }
});

function injectVueForm() {
  if (document.getElementById('vue-form-root')) return; // Prevent duplicates

  const root = document.createElement('div');
  root.id = 'vue-form-root';
  root.style.position = 'fixed';
  root.style.top = 0;
  root.style.left = 0;
  root.style.width = '100vw';
  root.style.height = '100vh';
  root.style.zIndex = 9999;
  root.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  document.body.appendChild(root);

  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('form.bundle.js'); // Vue app built & bundled
  script.type = 'module';
  root.appendChild(script);
}
