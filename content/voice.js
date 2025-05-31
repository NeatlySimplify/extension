export function readLabel(event) {
  event.preventDefault()
  const clickedElement = event.target
  let labelElement = null

  // Try finding label using aria-labelledby
  const ariaLabelledBy = clickedElement.getAttribute('aria-labelledby')
  if (ariaLabelledBy) {
    labelElement = document.getElementById(ariaLabelledBy)
  }

  // If not found, try finding label using element's id
  if (!labelElement) {
    const elementId = clickedElement.id
    if (elementId) {
      labelElement = document.querySelector(`label[for="${elementId}"]`)
    }
  }

  if (labelElement) {
    window.tts.speak(labelElement.textContent, { rate: 1.0 })
  } else {
    console.log('No label found for this element.')
  }
}

export async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    const audioChunks = []

    recorder.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data)
    })

    recorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audioElement = document.getElementById('audio-player')
      audioElement.src = audioUrl
      audioElement.play()
    })

    recorder.start()
    document.getElementById('stop-button').onclick = () => recorder.stop()
  } catch (error) {
    console.error('Error accessing microphone:', error)
  }
}
