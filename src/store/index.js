import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import user from './modules/user'
import post from './modules/post'
import chat from './modules/chat'
import messages from './modules/messages'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  mutations: {
    setLoading(state, status) {
      state.isLoading = status
    }
  },
  getters: {
    isLoading: (state) => state.isLoading
  },
  modules: {
    auth,
    user,
    post,
    chat,
    messages
  }
})
