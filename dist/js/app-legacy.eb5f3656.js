(function(){"use strict";var e={5603:function(e,t,o){o(6992),o(8674),o(9601),o(7727);var s=o(9567),n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"app"}},[o("icon-chatbot",{attrs:{initOpenProp:!1}})],1)},a=[],i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"open-chat",class:e.isOpen?"hide":"show",on:{click:e.toggleChatOpen}},[s("img",{staticClass:"imgIcon",attrs:{src:o(8642),alt:"ICONO"}})]),s("div",{staticClass:"chat-container",class:e.isOpen?"show":"hide"},[s("div",{staticClass:"chat-window"},[s("div",{staticClass:"close-chat",style:{background:e.iconColorProp},on:{click:e.toggleChatOpen}},[s("svg",{attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 60 60"}},[s("g",{attrs:{fill:"none",stroke:"#ffffff","stroke-width":"10","stroke-miterlimit":"10","stroke-linecap":"round"}},[s("path",{attrs:{d:"M10 10l45 45M10 55l45-45"}})])])]),s("div",{staticClass:"chat-header",style:{background:e.messageHeaderColorProp}},[s("h1",{staticClass:"imgTitle",attrs:{id:"title"}},[e._v("virtual assist")])]),s("div",{staticClass:"chat-header-mobile",style:{background:e.messageHeaderColorPropMobile}},[s("svg",{staticClass:"minimizeButton",attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 60 60"},on:{click:e.toggleChatOpen}},[s("g",{attrs:{fill:"none",stroke:"#ffffff","stroke-width":"10","stroke-miterlimit":"10","stroke-linecap":"round"}},[s("path",{attrs:{d:"M10 10l45 45M10 55l45-45"}})])])]),s("div",{ref:"chatArea",staticClass:"chat-area",style:{background:e.messageBackgroundColorProp},attrs:{id:"panelChat"}},e._l(e.messages,(function(t){return s("div",{key:t.id||t.body},[s("v-col",{class:{"col-out":"you"===t.author,"col-in":"you"!==t.author}},[s("v-row",{class:{"row-out":"you"===t.author,"row-in":"you"!==t.author}},["text"!==t.type||t.body.includes("http")?e._e():s("div",{ref:"mensajes",refInFor:!0,staticClass:"message",class:{"message-out":"you"===t.author,"message-in":"you"!==t.author},style:["you"===t.author?{background:e.messageOutColorProp}:{background:e.messageInColorProp}]},[s("span",{ref:"spanMensajes",refInFor:!0,staticClass:"spanMensajes"},[e._v(e._s(t.body))])]),"audio"===t.type?s("audio",{class:{"audio-out":"you"===t.author,"audio-in":"you"!==t.author},attrs:{controls:"controls",width:"20%",controlsList:"nodownload"}},[s("source",{attrs:{src:t.src}})]):e._e(),"button"===t.type?s("v-btn",{key:t.id,staticClass:"messageButton",class:{"message-out":"you"===t.author,"message-in":"you"!==t.author},attrs:{id:t.id,elevation:"2",color:"#eae8ea",rounded:""},on:{click:function(o){return e.optionSelected(t.body)}}},[e._v(e._s(t.body)+" ")]):e._e(),"text"===t.type&&t.body.includes("http")?s("div",{staticClass:"message",class:{"message-out":"you"===t.author,"message-in":"you"!==t.author},style:["you"===t.author?{background:e.messageOutColorProp}:{background:e.messageInColorProp}]},[s("a",{attrs:{target:"_blank",href:t.body}},[e._v(e._s(t.body))])]):e._e()],1)],1)],1)})),0),s("div",{staticClass:"chat-input"},[s("form",{staticClass:"chat-form",on:{submit:function(t){return t.preventDefault(),e.qyr()}}},[s("vue-record-audio",{attrs:{mode:"press"},on:{result:e.onResult,stream:e.mic}}),s("input",{directives:[{name:"model",rawName:"v-model",value:e.youMessage,expression:"youMessage"}],staticClass:"inputMessage",attrs:{type:"text",placeholder:e.messagePlaceholder,autofocus:""},domProps:{value:e.youMessage},on:{input:function(t){t.target.composing||(e.youMessage=t.target.value)}}}),s("button",{staticClass:"submit",attrs:{type:"submit"}},[s("feather-icon",{style:{color:e.iconColorProp,width:"25px"},attrs:{name:"send","base-class":"icon-send-message"}})],1)],1)])])])])},r=[],u=(o(1539),o(8783),o(3948),o(285),o(1637),o(3210),o(4747),o(4916),o(5306),o(1063)),l=o(8772),c=o.n(l),d=o(4029),h=o.n(d);s["default"].use(u.Z,"feather-icon"),s["default"].use(c());var g={sockets:{connect:function(){console.log("Conectado")},customEmit:function(){console.log("Enviar cosas")}},props:{messagePlaceholder:{type:String,default:"Type here..."},iconColorProp:{type:String,default:"#00316b"},messageBackgroundColorProp:{type:String,default:"#ffffff"},messageHeaderColorProp:{type:String,default:"#00316b"},messageHeaderColorPropMobile:{type:String,default:"#00316b"},messageOutColorProp:{type:String,default:"#00316b"},messageButton:{type:String,default:"#00316b"},messageInColorProp:{type:String,default:"#f1f0f0"},initOpenProp:Boolean},data:function(){return{youMessage:"",isOpen:!1,messages:[],recognition:null,isMicActive:!1,audioToText:"",idChat:0,spanWidth:0}},methods:{onResult:function(e){var t=this;this.recognition.stop(),console.log("stop"),this.recognition.onresult=function(e){var o=e.resultIndex,s="";s=e.results[o][0].transcript,this.audioToText+=s,console.log(this.audioToText),t.$emit("listened",this.audioToText)};var o=window.URL.createObjectURL(e);this.messages.push({body:this.youMessage,author:"you",date:new Date,type:"audio",src:o,id:this.messages.length}),this.messageScroll()},optionSelected:function(e){this.$emit("optClicked",e)},mic:function(){this.recognition.start(),console.log("Voice recognition activated. Try speaking into the microphone.")},sendToBack:function(e,t){this.$socket.emit(t,e)},qyr:function(){this.handleOutboundMessage(),this.messageScroll()},handleOutboundMessage:function(){var e=this;console.log("MM",this.youMessage),this.youMessage&&(this.youMessage.trim().length>0&&this.messages.push({body:this.youMessage,author:"you",date:new Date,type:"text",src:null,id:this.messages.length}),this.messageScroll(),this.$nextTick((function(){e.sendToBack({message:e.youMessage,nick:"you"},"chat-message"),e.sockets.subscribe("chat-emit",(function(t){console.log("msg",t),e.messages.push({body:t.message,author:"bot",date:new Date,type:"text",src:null,id:e.messages.length}),t.opts&&t.opts.length>0&&t.opts.forEach((function(t){e.messages.push({body:t,author:"bot",date:new Date,type:"button",src:null,id:e.messages.length})})),h()("#panelChat").animate({scrollTop:h()("#panelChat")[0].scrollHeight},1e3)})),e.messageScroll(),e.youMessage="",e.messageScroll()})),this.sockets.unsubscribe("chat-emit"),this.$nextTick((function(){console.log(e.messages[e.messages.length-1]),e.messageScroll()})))},toggleChatOpen:function(){this.isOpen=!this.isOpen,this.$emit("onToggleOpen",this.isOpen)},messageScroll:function(){var e=this.$refs.chatArea;e.scrollTop=e.scrollHeight}},mounted:function(){var e=this;try{var t=window.SpeechRecognition||window.webkitSpeechRecognition;this.recognition=new t}catch(n){console.error(n)}this.isOpen=this.initOpenProp||!1,this.messages.push({body:"Hi! How are you? Thank you for agreeing to talk to me. Could you rate your tourist experience in Ireland? It will be a short questionnaire",author:"bot",date:new Date,type:"text",src:null,id:this.messages.length}),this.sendToBack({message:"Hi! How are you? Thank you for agreeing to talk to me. Could you rate your tourist experience in Ireland? It will be a short questionnaire",nick:"Bot"},"chat-message"),this.messageScroll();var o=document.getElementsByClassName("chat-container")[0],s=window.innerHeight;o.style.height=s;this.$on("listened",(function(t){console.log("recibido"),e.youMessage=t.replace("undefined",""),e.qyr()})),this.$on("optClicked",(function(t){console.log("recibido"),e.youMessage=t,e.qyr()}))}},p=g,f=o(1001),m=(0,f.Z)(p,i,r,!1,null,"e59185b6",null),y=m.exports,b={name:"App",components:{IconChatbot:y}},v=b,C=(0,f.Z)(v,n,a,!1,null,null,null),w=C.exports,k=o(8209),O=o.n(k),x=(o(243),o(1950)),M=o.n(x);s["default"].use(O()),s["default"].use(new(M())({debug:!0,connection:"http://localhost:8080/",vuex:{actionPrefix:"SOCKET_",mutationPrefix:"SOCKET_"}})),s["default"].config.productionTip=!1,new s["default"]({render:function(e){return e(w)}}).$mount("#app")},8642:function(e,t,o){e.exports=o.p+"img/chatbot.f82cbe73.png"}},t={};function o(s){var n=t[s];if(void 0!==n)return n.exports;var a=t[s]={id:s,loaded:!1,exports:{}};return e[s].call(a.exports,a,a.exports,o),a.loaded=!0,a.exports}o.m=e,function(){var e=[];o.O=function(t,s,n,a){if(!s){var i=1/0;for(c=0;c<e.length;c++){s=e[c][0],n=e[c][1],a=e[c][2];for(var r=!0,u=0;u<s.length;u++)(!1&a||i>=a)&&Object.keys(o.O).every((function(e){return o.O[e](s[u])}))?s.splice(u--,1):(r=!1,a<i&&(i=a));if(r){e.splice(c--,1);var l=n();void 0!==l&&(t=l)}}return t}a=a||0;for(var c=e.length;c>0&&e[c-1][2]>a;c--)e[c]=e[c-1];e[c]=[s,n,a]}}(),function(){o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,{a:t}),t}}(),function(){o.d=function(e,t){for(var s in t)o.o(t,s)&&!o.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){o.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){o.p="/"}(),function(){var e={143:0};o.O.j=function(t){return 0===e[t]};var t=function(t,s){var n,a,i=s[0],r=s[1],u=s[2],l=0;if(i.some((function(t){return 0!==e[t]}))){for(n in r)o.o(r,n)&&(o.m[n]=r[n]);if(u)var c=u(o)}for(t&&t(s);l<i.length;l++)a=i[l],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(c)},s=self["webpackChunkvue_chat"]=self["webpackChunkvue_chat"]||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))}();var s=o.O(void 0,[998],(function(){return o(5603)}));s=o.O(s)})();
//# sourceMappingURL=app-legacy.eb5f3656.js.map