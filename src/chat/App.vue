<script setup>
import { startRecording } from '.../content/voice'
import { sendAudioToGemini } from '.../content/ai'
import { sendToGeminiPro } from '../../content/ai'
import { ref } from 'vue'
import friendRobot from './assets/icon.svg'

const messages = ref([{ user: 'bot', text: 'Hello! How can I help you?' }])
const objectives = ref([])
const newMessage = ref('')
const activeTab = ref('converse') // 'converse' or 'plan'
const isChatVisible = ref(true)

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    messages.value.push({ user: 'user', text: newMessage.value })
    const result = sendToGeminiPro(newMessage.value)
    messages.value.push({ user: 'bot', text: result })
    newMessage.value = '' // Clear the input field
  }
}

const startRecordingAndTranscribe = async () => {
  try {
    const audioElement = document.getElementById('audio-player')
    audioElement.addEventListener('stop', async () => {
      const transcription = await sendAudioToGemini(audioElement.src)
      messages.value.push({ user: 'user', text: transcription })
    })
    await startRecording()
  } catch (error) {
    console.error('Error starting recording or transcribing:', error)
  }
}

const createObjective = async () => {
  if (newMessage.value.trim() != '') {
    const response = sendToGeminiPro(newMessage.value)
    if (response.status == 'error') {
      // Colocar aqui lógica de loop
    } else {
      for (let object in response.result) {
        objectives.value.push(object)
      }
    }
  }
}
</script>

<template>
  <div v-if="isChatVisible" class="chat-window bottom-right-chat">
    <div class="chat-header">
      <button @click="isChatVisible = false" class="hide-button">Hide</button>
      <div class="tabs">
        <button :class="{ active: activeTab === 'converse' }" @click="activeTab = 'converse'">
          Converse
        </button>
        <button :class="{ active: activeTab === 'plan' }" @click="activeTab = 'plan'">
          Plan action
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'converse'" class="converse-tab">
      <div class="message-list">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{
            'user-message': message.user === 'user',
            'bot-message': message.user === 'bot',
          }"
        >
          {{ message.text }}
        </div>
      </div>
      <div class="input-area">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type your message..."
          @keyup.enter="createObjective"
        />
        <button @click="createObjective" class="send-button">Send</button>
        <button @click="startRecordingAndTranscribe" class="record-button">Record</button>
        <audio id="audio-player" controls style="display: none"></audio>
      </div>
    </div>

    <div v-else-if="activeTab === 'plan'" class="plan-tab">
      <h2>Plan Action</h2>
      <p>This is where the plan action content will go.</p>
      <div class="input-area">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type your message..."
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" class="send-button">Send</button>
        <button @click="startRecordingAndTranscribe" class="record-button">Record</button>
        <audio id="audio-player" controls style="display: none"></audio>
      </div>
    </div>
  </div>
  <div v-else class="bottom-right-chat">
    <img :src="friendRobot" class="image-css" />
  </div>
</template>

<style scoped>
.image-css {
  border-radius: 40px;
}
.chat-window {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.hide-button {
  background-color: #ccc;
  border: none;
  cursor: pointer;
}

.tabs {
  display: flex;
}

.tabs button {
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tabs button.active {
  border-bottom: 2px solid #3498db;
}

.message-list {
  flex-grow: 1;
  padding: 10px;
  overflow-y: scroll;
}

.user-message {
  background-color: #dcf8c6;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 5px;
  align-self: flex-end;
}

.bot-message {
  background-color: #ece5dd;
  padding: 8px;
  border-radius: 5px;
  margin-bottom: 5px;
  align-self: flex-start;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

input[type='text'] {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

.send-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.record-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
