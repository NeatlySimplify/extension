export function injectFrame() {
  const iframe = document.createElement('iframe')
  iframe.id = 'vue-chat-root'
  iframe.src = window.runtime.getURL('dist/index.html')

  // Initial state: icon only
  iframe.style.position = 'fixed'
  iframe.style.bottom = '20px'
  iframe.style.right = '20px'
  iframe.style.width = '40px'
  iframe.style.height = '40px'
  iframe.style.border = 'none'
  iframe.style.zIndex = '999999'
  iframe.style.background = 'transparent' // Allow underlying page to show
  iframe.style.overflow = 'hidden' // Prevent internal scrollbars

  document.body.appendChild(iframe)
}
export function injectVueForm() {
  window.runtime.onInstalled.addListener(() => {
    window.tabs.create({
      url: window.runtime.getURL('dist/form.html'),
    })
  })
}
