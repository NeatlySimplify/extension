<template>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <input v-model="userData" placeholder="Digite seu nome" />
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script setup>
  
const submitForm = () => {
  chrome.runtime.sendMessage({
    type: 'SAVE_USER_SETTINGS',
    value: this.userData
  }, () => {
    // Remove form from DOM
    document.getElementById('vue-form-root')?.remove();
  });
}
  

</script>
