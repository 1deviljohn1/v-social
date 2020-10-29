import firebase from 'firebase/app'

export default {
  state: {
    messages: []
  },

  getters: {
    messages: (state) => state.messages
  },

  mutations: {
    setMessages(state, messages) {
      state.messages = messages
    }
  },

  actions: {
    sendMessage(ctx, { message, from, to }) {
      return firebase
        .firestore()
        .collection('messages')
        .add({
          from,
          to,
          message,
          createdAt: Date.now()
        })
    },
    fetchMessages({ commit }, { from, to }) {
      return new Promise((resolve) => {
        let messages = []
        firebase
          .firestore()
          .collection('messages')
          .orderBy('createdAt')
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              let message = change.doc.data()
              const chatMembers = [from, to]

              if (!chatMembers.includes(message.to) || !chatMembers.includes(message.from)) {
                return
              }

              if (change.type === 'added') {
                messages.push({
                  ...message,
                  id: change.doc.id
                })
              } else if (change.type === 'removed') {
                messages = messages.filter((message) => message.id !== change.doc.id)
              }
            })

            commit('setMessages', messages)
            resolve()
          })
      })
    },
    removeMessage(ctx, message) {
      return firebase
        .firestore()
        .collection('messages')
        .doc(message)
        .delete()
    }
  }
}
