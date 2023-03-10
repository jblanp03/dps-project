import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import VueSocketIO from 'vue-socket.io'

Vue.use(Vuetify);
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8080/',
    vuex: {
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')