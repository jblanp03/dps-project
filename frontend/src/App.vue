<template>
  <div id="app">
    <icon-chatbot :initOpenProp="false"></icon-chatbot>
  </div>
</template>

<script>
import IconChatbot from './components/iconChatbot.vue'

export default {
  name: 'App',
  components: {
    IconChatbot,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
