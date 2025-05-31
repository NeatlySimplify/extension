import { injectVueForm } from "./inject";

function blindControl() {
  var recognition = new SpeechRecognition();
  var voice = new SpeechSynthesis()
  const fillInput = (fieldID) =>{
    recognition.onresult = function(event) {
      if (event.results.length > 0) {
        fieldID.value = event.results[0][0].transcript;

    }
  };
  const selectInput = (fieldID) =>{
    recognition.maxAlternatives = 10;
    recognition.onresult = function(event) {
      if (event.results.length > 0) {
        var result = event.results[0];
        for (var i = 0; i < result.length; ++i) {
          var text = result[i].transcript;
          fieldID.options[i] = new Option(text, text);
        }
      }
    }
    function start() {
      select.options.length = 0;
      recognition.start();
    }
    start()
  };
  const textareaInput = (fieldID) =>{
    var recognizing;
    recognition.continuous = true;
    reset();
    recognition.onend = reset;

    recognition.onresult = function (event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          textarea.value += event.results[i][0].transcript;
        }
      }
    }

    function reset() {
      recognizing = false;
      button.innerHTML = "Click to Speak";
    }

    function toggleStartStop() {
      if (recognizing) {
        recognition.stop();
        reset();
      } else {
        recognition.start();
        recognizing = true;
        button.innerHTML = "Click to Stop";
      }
    }
  };


  // Logic for blind users (voice interaction)
  // Example: Add event listeners to relevant elements to call readLabel
  document.querySelectorAll('input, select, textarea, button, a').forEach(element => {
    element.addEventListener('focus', readLabel);
  });
}

function visualControl() {
  // Logic for sighted users (visual focus indication)
  // This function will be called, but the focusInput function itself handles the visual part on demand.
  // You might add other visual accessibility features here later if needed.
}

function initializeAccessibility() {
  window.runtime.sendMessage({ type: 'GET_LOCAL_STORAGE', key: 'accessibilitySettings' }, (response) => {
    if (response && response.status === 'success' && response.data && response.data.accessibility) {
      const accessibilityMode = response.data.accessibility;
      if (accessibilityMode === 'blind') {
        blindControl();
      } else {
        visualControl();
      }
    } else {
      // If no settings are found, inject the form
      injectVueForm();
    }
  });
}

window.addEventListener("message", (event) => {
  if (event.data?.type === "toogle-size") {
    const iframe = document.getElementById("vue-chat-root");
    if (iframe) {
      iframe.style.width = `${event.data.width}px`;
      iframe.style.height = `${event.data.height}px`;
    }
  }
});

// Initialize accessibility features when the content script loads
initializeAccessibility()
