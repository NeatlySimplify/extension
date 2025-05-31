<template>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <input v-model="userData" placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return { userData: '' };
  },
  methods: {
    submitForm() {
      chrome.runtime.sendMessage({
        type: 'SAVE_COOKIE',
        value: this.userData
      }, () => {
        // Remove form from DOM
        document.getElementById('vue-form-root')?.remove();
      });
    }
  }
}
</script>
