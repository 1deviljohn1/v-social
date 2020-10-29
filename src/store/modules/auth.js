import firebase from 'firebase/app'
import router from '@/router'

export default {
  state: {
    authCode: ''
  },

  mutations: {
    setAuthCode(state, message) {
      state.authCode = message
    }
  },

  actions: {
    async createUser({ commit }, { alias, dob, country, email, password }) {
      try {
        const res = await firebase.auth().createUserWithEmailAndPassword(email, password)
        commit('setAuthCode', '')

        res.user.updateProfile({
          displayName: alias
        })

        const userData = {
          uid: res.user.uid,
          alias,
          email,
          dob,
          country,
          info: '',
          photoUrl: '',
          subscriptions: '',
          createdAt: Date.now()
        }

        commit('setCurrentUserData', userData)

        const db = firebase.firestore()
        const batch = db.batch()
        const increment = firebase.firestore.FieldValue.increment(1)
        const statsRef = db.collection('stats').doc('users')
        const userRef = db.collection('users').doc(alias)

        batch.set(statsRef, { userCount: increment }, { merge: true })
        batch.set(userRef, userData)

        await batch.commit()

        const usersNumber = (await statsRef.get()).data().userCount
        if (usersNumber === 1) {
          userRef.set({ isFirstUser: true }, { merge: true })
        }

        router.push({ name: 'Home' })
      } catch (error) {
        commit('setAuthCode', error.code)
      }
    },
    async loginUser({ commit, dispatch }, { email, password }) {
      try {
        commit('setAuthCode', '')

        const res = await firebase.auth().signInWithEmailAndPassword(email, password)
        await dispatch('fetchCurrentUserData', res.user.uid)

        router.push({ name: 'Home' })
      } catch (error) {
        commit('setAuthCode', error.code)
      }
    },
    async logoutUser() {
      try {
        await firebase.auth().signOut()
        router.push({ name: 'Auth' })
      } catch (error) {
        return error.message
      }
    }
  },

  getters: {
    authCode: (state) => state.authCode
  }
}
