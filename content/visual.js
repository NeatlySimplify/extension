export function focusInput(inputId) {
    const element = document.getElementById(inputId);
    const parent = element.parentElement
    if (element && parent) {
      // Remove existing focus-ring from any element
      const elementsWithFocusRing = document.querySelectorAll('.focus-ring');
      elementsWithFocusRing.forEach(el => el.classList.remove('focus-ring'));
  
      element.classList.add('focus-ring');
      parent.classList.add('focus-ring');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      console.error(`Element with ID "${inputId}" not found.`);
    }
}


