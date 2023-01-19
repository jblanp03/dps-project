<template>
  <div>
    <div
      class="open-chat"
      :class="isOpen ? 'hide' : 'show'"
      @click="toggleChatOpen"
    >
      <img src="../assets/chatbot.png" class="imgIcon" alt="ICONO" />
    </div>
    <div class="chat-container" :class="isOpen ? 'show' : 'hide'">
      <div class="chat-window">
        <div
          class="close-chat"
          @click="toggleChatOpen"
          :style="{ background: iconColorProp }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
            <g
              fill="none"
              stroke="#ffffff"
              stroke-width="10"
              stroke-miterlimit="10"
              stroke-linecap="round"
            >
              <path d="M10 10l45 45M10 55l45-45" />
            </g>
          </svg>
        </div>
        <div
          class="chat-header"
          :style="{ background: messageHeaderColorProp }"
        >
          <h1 id="title" class="imgTitle">virtual assist</h1>
        </div>
        <div
          class="chat-header-mobile"
          :style="{ background: messageHeaderColorPropMobile }"
        >
          <svg
            class="minimizeButton"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 60"
            @click="toggleChatOpen"
          >
            <g
              fill="none"
              stroke="#ffffff"
              stroke-width="10"
              stroke-miterlimit="10"
              stroke-linecap="round"
            >
              <path d="M10 10l45 45M10 55l45-45" />
            </g>
          </svg>
        </div>

        <div
          ref="chatArea"
          class="chat-area"
          id="panelChat"
          :style="{ background: messageBackgroundColorProp }"
        >
          <div v-for="message in messages" :key="message.id || message.body">
            <v-col
              :class="{
                'col-out': message.author === 'you',
                'col-in': message.author !== 'you',
              }"
            >
              <v-row
                :class="{
                  'row-out': message.author === 'you',
                  'row-in': message.author !== 'you',
                }"
              >
                <div
                  v-if="
                    message.type === 'text' && !message.body.includes('http')
                  "
                  class="message"
                  :style="[
                    message.author === 'you'
                      ? { background: messageOutColorProp }
                      : { background: messageInColorProp },
                  ]"
                  :class="{
                    'message-out': message.author === 'you',
                    'message-in': message.author !== 'you',
                  }"
                  ref="mensajes"
                >
                  <span ref="spanMensajes" class="spanMensajes">{{ message.body }}</span>
                </div>
                <audio
                  v-if="message.type === 'audio'"
                  controls="controls"
                  :class="{
                    'audio-out': message.author === 'you',
                    'audio-in': message.author !== 'you',
                  }"
                  width="20%"
                  controlsList="nodownload"
                >
                  <source :src="message.src" />
                </audio>

                <v-btn
                  v-if="message.type === 'button'"
                  :key="message.id"
                  :id="message.id"
                  :class="{
                    'message-out': message.author === 'you',
                    'message-in': message.author !== 'you',
                  }"
                  class="messageButton"
                  elevation="2"
                  color="#eae8ea"
                  rounded
                  v-on:click="optionSelected(message.body)"
                  >{{ message.body }}
                </v-btn>
                <div
                  v-if="
                    message.type === 'text' && message.body.includes('http')
                  "
                  class="message"
                  :style="[
                    message.author === 'you'
                      ? { background: messageOutColorProp }
                      : { background: messageInColorProp },
                  ]"
                  :class="{
                    'message-out': message.author === 'you',
                    'message-in': message.author !== 'you',
                  }"
                >
                  <a target="_blank" :href="message.body">{{ message.body }}</a>
                </div>
              </v-row>
            </v-col>
          </div>
        </div>
        <div class="chat-input">
          <form @submit.prevent="qyr()" class="chat-form">
            <vue-record-audio
              @result="onResult"
              @stream="mic"
              mode="press"
            ></vue-record-audio>
            <input
              class="inputMessage"
              v-model="youMessage"
              type="text"
              :placeholder="messagePlaceholder"
              autofocus
            />
            <button class="submit" type="submit">
              <feather-icon
                name="send"
                base-class="icon-send-message"
                :style="{ color: iconColorProp, width: '25px' }"
              ></feather-icon>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from "vue";
import feather from "vue-icon";
Vue.use(feather, "feather-icon");
import VueRecord from "@codekraft-studio/vue-record";
import axios from "axios";
import $ from "jquery";
Vue.use(VueRecord);
export default {
  sockets: {
    connect: function () {
      console.log("Conectado");
    },
    customEmit: function () {
      console.log("Enviar cosas");
    },
  },
  props: {
    messagePlaceholder: {
      type: String,
      default: "Type here...",
    },
    iconColorProp: {
      type: String,
      default: "#00316b",
    },
    messageBackgroundColorProp: {
      type: String,
      default: "#ffffff",
    },
    messageHeaderColorProp: {
      type: String,
      default: "#00316b",
    },
    messageHeaderColorPropMobile: {
      type: String,
      default: "#00316b",
    },
    messageOutColorProp: {
      type: String,
      default: "#00316b",
    },
    messageButton: {
      type: String,
      default: "#00316b",
    },
    messageInColorProp: {
      type: String,
      default: "#f1f0f0",
    },
    initOpenProp: Boolean,
  },
  data: () => {
    return {
      youMessage: "",
      isOpen: false,
      messages: [],
      recognition: null,
      isMicActive: false,
      audioToText: "",
      idChat: 0,
      spanWidth: 0,
    };
  },
  methods: {
    onResult(data) {
      var vm = this;
      this.recognition.stop();
      console.log("stop");
      this.recognition.onresult = function (event) {
        // event is a SpeechRecognitionEvent object.
        // It holds all the lines we have captured so far.
        // We only need the current one.
        var current = event.resultIndex;
        var transcript = "";
        // Get a transcript of what was said.
        transcript = event.results[current][0].transcript;
        // Add the current transcript to the contents of our Note.
        this.audioToText += transcript;
        console.log(this.audioToText);
        vm.$emit("listened", this.audioToText);
      };
      var audioUrl = window.URL.createObjectURL(data);

      this.messages.push({
        body: this.youMessage,
        author: "you",
        date: new Date(),
        type: "audio",
        src: audioUrl,
        id: this.messages.length,
      });

      this.messageScroll();
    },
    optionSelected(opt) {
      this.$emit("optClicked", opt);
    },
    mic() {
      this.recognition.start();
      console.log(
        "Voice recognition activated. Try speaking into the microphone."
      );
    },
    sendToBack(message, orden) {
      this.$socket.emit(orden, message);
    },
    qyr() {
      this.handleOutboundMessage();
      this.messageScroll();
    },
    handleOutboundMessage() {
      if (!this.youMessage) {
        return;
      }
      if (this.youMessage.trim().length > 0) {
        this.messages.push({
          body: this.youMessage,
          author: "you",
          date: new Date(),
          type: "text",
          src: null,
          id: this.messages.length,
        });
      }

      this.messageScroll();
      this.$nextTick(() => {
        this.sendToBack(
          { message: this.youMessage, nick: "you" },
          "chat-message"
        );
        this.sockets.subscribe("chat-emit", (msg) => {
          this.messages.push({
            body: msg.message,
            author: "bot",
            date: new Date(),
            type: "text",
            src: null,
            id: this.messages.length,
          });
          if (msg.opts && msg.opts.length > 0) {
            msg.opts.forEach((op) => {
              this.messages.push({
                body: op,
                author: "bot",
                date: new Date(),
                type: "button",
                src: null,
                id: this.messages.length,
              });
            });
          }
          $("#panelChat").animate(
            { scrollTop: $("#panelChat")[0].scrollHeight },
            1000
          );
        });
        this.messageScroll();
        this.youMessage = "";

        this.messageScroll();
      });
      this.sockets.unsubscribe("chat-emit");
      this.$nextTick(() => {
        console.log(this.messages[this.messages.length - 1]);
        this.messageScroll();
      });
    },
    toggleChatOpen() {
      this.isOpen = !this.isOpen;
      this.$emit("onToggleOpen", this.isOpen);
    },
    messageScroll() {
      let messageDisplay = this.$refs.chatArea;
      messageDisplay.scrollTop = messageDisplay.scrollHeight;
    },
  },
  /* eslint-disable */
  mounted() {
    try {
      var SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
    } catch (e) {
      console.error(e);
    }

    this.isOpen = this.initOpenProp || false;

    let datos = {
      name: "a",
      createdAt: "2021-09-28",
      updatedAt: "2021-09-28",
      origin: 0,
    };
    axios
      .post("http://localhost:8080/api/chat/create", datos)
      .then((result) => {
        console.log(result.data);
        this.idChat = result.data.id;
        console.log(this.idChat);
      });

    this.messages.push({
      body: "Hi! How are you? Thank you for agreeing to talk to me. Could you rate your tourist experience in Ireland? It will be a short questionnaire",
      author: "bot",
      date: new Date(),
      type: "text",
      src: null,
      id: this.messages.length,
    });
    this.sendToBack(
      {
        message:
          "Hi! How are you? Thank you for agreeing to talk to me. Could you rate your tourist experience in Ireland? It will be a short questionnaire",
        nick: "Bot",
      },
      "chat-message"
    );

    this.messageScroll();

    var area = document.getElementsByClassName("chat-container")[0];
    var alt = window.innerHeight;
    area.style.height = alt;
    var vm = this;
    this.$on("listened", (texto) => {
      console.log("recibido");
      this.youMessage = texto.replace("undefined", "");
      this.qyr();
    });
    this.$on("optClicked", (opt) => {
      console.log("recibido");
      this.youMessage = opt;
      this.qyr();
    });

    this.sockets.subscribe(`chat-message${this.idChat}`, (data) => {
      console.log("Data: ", data);
    });
  },
};
</script>

<!-- <style lang="scss">
.vue-audio-recorder {
  position: relative;
  background-color: #3d7ce0; //color de fondo inicial
  border-radius: 50%;
  width: 3em;
  height: 3em;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 0 0 0 #7ba3e3; //sombra
  &:hover {
    background-color: #8eacdd on hover;
  }
  &.active {
    background-color: #7ba3e3; //color activo
    -webkit-animation: pulse 1.25s infinite cubic-bezier(0.66, 1, 1, 0);
    -moz-animation: pulse 1.25s infinite cubic-bezier(0.66, 1, 1, 0);
    animation: pulse 1.25s infinite cubic-bezier(0.66, 1, 1, 0);
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    background-color: #fff;
  }
  &:after {
    top: 30%;
    left: 43%;
    height: 15%;
    width: 14%;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
  }
  &:before {
    top: 40%;
    left: 43%;
    height: 15%;
    width: 14%;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
  }
  span {
    position: absolute;
    top: 50%;
    left: 36%;
    height: 24%;
    width: 28%;
    overflow: hidden;
    &:before,
    &:after {
      content: "";
      position: absolute;
      background-color: #fff;
    }
    &:before {
      bottom: 50%;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      border: 0.125em solid #fff;
      background: none;
      left: 0;
    }
    &:after {
      top: 50%;
      left: 40%;
      width: 20%;
      height: 25%;
    }
  }
}
.chat-area {
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background-color: darkgrey;
  }
  &::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 20px #7ba3e3;
  }
}
</style> -->

<style scoped>
/*TRIPLE DESDE NARNIA*/
.vue-audio-recorder {
  position: relative;
  background-color: #00316b;
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  display: inline-block;
  cursor: pointer;
  box-shadow: 0 0 0 0 #7ba3e3;
}
.vue-audio-recorder:hover {
  background-color: #8eacdd on hover;
}
.vue-audio-recorder.active {
  background-color: #7ba3e3;
  -webkit-animation: pulse 1.25s infinite cubic-bezier(0.66, 1, 1, 0);
  -moz-animation: pulse 1.25s infinite cubic-bezier(0.66, 1, 1, 0);
  animation: pulse 1.25s infinite cubic-bezier(0.66, 1, 1, 0);
}
.vue-audio-recorder:before,
.vue-audio-recorder:after {
  position: absolute;
  background-color: #fff;
}
.vue-audio-recorder:after {
  top: 30%;
  left: 43%;
  height: 15%;
  width: 14%;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
}
.vue-audio-recorder:before {
  top: 40%;
  left: 43%;
  height: 15%;
  width: 14%;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}
.vue-audio-recorder span {
  position: absolute;
  top: 50%;
  left: 36%;
  height: 24%;
  width: 28%;
  overflow: hidden;
}
.vue-audio-recorder span:before,
.vue-audio-recorder span:after {
  position: absolute;
  background-color: #fff;
}
.vue-audio-recorder span:before {
  bottom: 50%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  border: 0.125em solid #fff;
  background: none;
  left: 0;
}
.vue-audio-recorder span:after {
  top: 50%;
  left: 40%;
  width: 20%;
  height: 25%;
}
.chat-area::-webkit-scrollbar {
  width: 6px;
}
.chat-area::-webkit-scrollbar-track {
  background-color: darkgrey;
}
.chat-area::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 20px #7ba3e3;
}
/*FIN DEL TRIPLE DESDE NARNIA*/
audio {
  margin-bottom: 0.5em;
}
* {
  box-sizing: border-box;
}
#title {
  font-size: 5em;
  font-family: "Amatic SC", cursive;
  position: absolute;
  right: 0; /* se debe usar para que margin 0 auto funcione */
  left: 0; /* se debe usar para que margin 0 auto funcione */
  margin: 0 auto; /* Esto lo centra */
}
.headline {
  text-align: center;
  font-weight: 100;
  color: white;
}
.chat-container {
  /* font-family: "Amatic SC", cursive; */
  position: fixed;
  bottom: 50px;
  right: 50px;
  max-width: 30%;
  width: 100%;
  height: 70%;
  z-index: 10000;
  transform: scale(0);
  transform-origin: right bottom;
  border: 0px solid #7ba3e3;
  border-radius: 1em;
}

.chat-header {
  min-height: 110px;
  border: 0px solid #7ba3e3;
  border-radius: 0.6em;
  position: sticky;
}

.imgTitle {
  height: auto;
  width: 40%;
}

.imgIcon {
  height: 8em;
  width: 8em;
}

.chat-container.show {
  animation: scaleIn 0.15s ease-in-out 0s 1 normal forwards;
}
.chat-container.hide {
  display: none;
}
.chat-window {
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 10px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  border: 0px solid #7ba3e3;
  border-radius: 0em;
  position: relative;
}

.chat-area {
  position: absolute;
  border-radius: 0em;
  overflow-x: none;
  overflow-y: auto;
  padding: 25px 20px 20px 20px;
  margin-bottom: 35px;
  width: 100%;
  height: 70%;
  top: 6.7em;
  scroll-behavior: smooth;
  z-index: 1;
}

.message {
  max-width: 80%;
  border-radius: 5px;
  padding: 0.5em;
  font-size: 0.8em;
  margin-bottom: 0.5em;
  text-align: left;
  width: auto;
}

span {
  display: inline-block;
}

.messageButton {
  width: 50%;
  border: 1px solid #dc3adf;
  border-radius: 0.6em;
  padding: 0.5em;
  font-size: x-large;
  margin-bottom: 0.5em;
}
.message-out {
  color: #ffffff;
  margin-left: 20%;
  font-size: 100%;
}
.message-in {
  background: #f1f0f0;
  color: black;
  margin-right: 20%;
  font-size: 100%;
}

.message .spanMensajes{
  overflow-wrap: break-word;
  word-wrap: break-word;
}

audio {
  width: 70%;
}
.audio-out {
  color: #ffffff;
  margin-left: 30%;
}
.audio-in {
  background: #f1f0f0;
}

.chat-inputs {
  display: flex;
  justify-content: space-between;
}
.chat-input input {
  border: none;
  font-size: 0.8em;
  outline: none;
  padding: 1.5em;
  width: 90%;
}

.chat-input {
  position: absolute;
  z-index: 2;
  width: 100%;
  bottom: 0;
}
.chat-form {
  background: #ffffff;
  border-top: 1px solid #e9e9e9;
  border-radius: 0 0 3px 3px;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  width: 100%;
  padding: 0.5em;
  border: 1px solid white;
  border-radius: 1em;
}
.submit {
  -webkit-appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;
}
.submit:focus {
  outline: none;
}
.submit-icon {
  width: 20px;
}
.close-chat {
  position: absolute;
  right: -40px;
  top: -40px;
  width: 35px;
  border-radius: 50%;
  height: 35px;
  background: #f7f7f7;
  cursor: pointer;
  transform: scale(0);
  display: flex;
  justify-content: center;
  align-items: center;
}
.chat-container.show .close-chat {
  animation: scaleIn 0.15s ease-in-out 0.3s 1 normal forwards;
}
.close-chat svg {
  position: relative;
  left: -1px;
  width: 20px;
}
.open-chat {
  position: fixed;
  width: 8em;
  right: 50px;
  bottom: 25px;
  cursor: pointer;
  z-index: 900;
  transform: scale(0);
}
.open-chat.hide {
  display: none;
}
.open-chat.show {
  animation: scaleIn 0.15s ease-in-out 0.15s 1 normal forwards;
}
div > .row-in {
  flex-direction: row;
}
div > .row-out {
  flex-direction: row-reverse;
}

.chat-header-mobile {
  display: none;
  z-index: 3;
}

.inputMessage {
  background: #f1f0f0;
  border: 0px solid #7ba3e3;
  padding: 20px;
  border-radius: 5px;
}

@media (max-height: 600px), (max-width: 1135px) {
  .chat-container {
    min-width: 100%;
    height: 100%;
    bottom: 0;
    max-height: 100%;
    left: 0;
    right: 0;
  }

  .chat-area {
    overflow-x: none;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    scroll-behavior: smooth;
    z-index: 1;
    position: sticky;
    border-radius: 0em;
  }

  .chat-header {
    display: none;
  }
  #title{
    font-size: large;
  }
  .chat-header-mobile {
    display: block;
    z-index: 3;
    overflow: auto;
    background: #7ba3e3;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    height: 60px;
  }

  .minimizeButton {
    margin-right: 10px;
    margin-top: 10px;
    width: 30px;
    height: 30px;
    float: right;
  }

  .minimize {
    width: 40px;
    height: 40px;
    background-color: initial;
    border: 0;
    color: #fff;
    outline: 0;
    position: absolute;
    z-index: -1;
  }
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
