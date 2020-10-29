import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'
import convertAuthCode from '@/filters/messages'
import { formatDate, formatDatetime, formatDatetimeFromNow } from '@/filters/datetime'
import VueChatScroll from 'vue-chat-scroll'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'
import '@/assets/styles/styles.scss'

Vue.config.productionTip = false

Vue.use(VueChatScroll)
Vue.filter('convertAuthCode', convertAuthCode)
Vue.filter('formatDate', formatDate)
Vue.filter('formatDatetime', formatDatetime)
Vue.filter('formatDatetimeFromNow', formatDatetimeFromNow)

firebase.initializeApp({
  apiKey: 'AIzaSyBtYUCZODtlhMj7docRlEXeywnz6mHzOek',
  authDomain: 'v-social-210d0.firebaseapp.com',
  databaseURL: 'https://v-social-210d0.firebaseio.com',
  projectId: 'v-social-210d0',
  storageBucket: 'v-social-210d0.appspot.com',
  messagingSenderId: '8131849473',
  appId: '1:8131849473:web:f9b831bbc495a391a5bf00'
})

let app

firebase.auth().onAuthStateChanged(async (user) => {
  if (user) {
    await store.dispatch('fetchCurrentUserData', user.uid)
  }

  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App)
    }).$mount('#app')
  }
})
