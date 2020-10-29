import firebase from 'firebase/app'

export default {
  state: {
    currentUserData: {},
    profileUserData: {},
    usersCount: null
  },

  getters: {
    currentUserData: (state) => state.currentUserData,
    userSubscriptions: (state) => state.currentUserData.subscriptions,
    profileUserData: (state) => state.profileUserData,
    usersCount: (state) => state.usersCount
  },

  mutations: {
    setCurrentUserData(state, data) {
      state.currentUserData = data
    },
    setProfileUserData(state, data) {
      state.profileUserData = data
    },
    setUsersCount(state, usersCount) {
      state.usersCount = usersCount
    }
  },

  actions: {
    async fetchCurrentUserData({ commit }, user) {
      return firebase
        .firestore()
        .collection('users')
        .where('uid', '==', user)
        .get()
        .then((res) => {
          commit('setCurrentUserData', res.docs[0].data())
        })
    },
    listenCurrentUserData({ commit }, user) {
      firebase
        .firestore()
        .collection('users')
        .where('alias', '==', user)
        .onSnapshot((snapshot) => {
          commit('setCurrentUserData', snapshot.docChanges()[0].doc.data())
        })
    },
    async fetchProfileUserData({ commit }, alias) {
      const res = await firebase
        .firestore()
        .collection('users')
        .where('alias', '==', alias)
        .get()

      commit('setProfileUserData', res.docs[0].data())
    },
    async isAliasAvailable(ctx, alias) {
      const result = await firebase
        .firestore()
        .collection('users')
        .where('alias', '==', alias)
        .get()

      return result.docs.length ? false : true
    },
    async fetchUsers(ctx, aliases) {
      const users = []

      if (aliases.length) {
        await firebase
          .firestore()
          .collection('users')
          .where('alias', 'in', aliases)
          .get()
          .then((res) => {
            res.docs.forEach((user) => {
              users.push(user.data())
            })
          })
      } else {
        await firebase
          .firestore()
          .collection('users')
          .get()
          .then((res) => {
            res.docs.forEach((user) => {
              users.push(user.data())
            })
          })
      }

      return users
    },
    async uploadProfileImage({ dispatch }, { file, metadata, user }) {
      const upload = await firebase
        .storage()
        .ref()
        .child('images/' + user)
        .put(file, metadata)
      const url = await upload.ref.getDownloadURL()
      await dispatch('updatePhotoUrl', { url, user })
    },
    async updatePhotoUrl(ctx, { url, user }) {
      await firebase
        .firestore()
        .collection('users')
        .doc(user)
        .update({
          photoUrl: url
        })
    },
    updateInfo(ctx, { info, user }) {
      return firebase
        .firestore()
        .collection('users')
        .doc(user)
        .update({
          info
        })
    },
    manageSubscription(ctx, { user, followedUser, add }) {
      let subArr = Object.values(user.subscriptions)

      if (add) {
        subArr.push(followedUser)
      } else {
        subArr = subArr.filter((el) => {
          return el !== followedUser
        })
      }

      return firebase
        .firestore()
        .collection('users')
        .doc(user.alias)
        .update({
          subscriptions: subArr
        })
    },
    async fetchUsersCount({ commit }) {
      const db = firebase.firestore()
      const statsRef = db.collection('stats').doc('users')
      const usersNumber = (await statsRef.get())

      if (usersNumber.data()) {
        commit('setUsersCount', usersNumber.data().userCount)
      }

    }
  }
}
