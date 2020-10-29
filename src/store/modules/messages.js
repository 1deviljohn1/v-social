import firebase from 'firebase/app'

export default {
  actions: {
    async fetchUsersFromMessages({ getters }) {
      let users = []
      const currentUser = getters.currentUserData.alias
      await firebase
        .firestore()
        .collection('messages')
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.forEach((message) => {
            if ([message.data().from, message.data().to].includes(currentUser)) {
              users.push(message.data().from)
              users.push(message.data().to)
            }
          })

          users = users.filter((user, i, arr) => {
            return user !== currentUser && arr.indexOf(user) === i
          })
        })

      return users
    }
  }
}