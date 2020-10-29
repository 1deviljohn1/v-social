import firebase from 'firebase/app'

export default {
  state: {
    posts: [],
    photos: []
  },

  getters: {
    posts: (state) => state.posts,
    photos: (state) => state.photos
  },

  mutations: {
    setPosts(state, posts) {
      state.posts = posts
    }
  },

  actions: {
    fetchPosts({ commit }, users) {
      return new Promise((resolve) => {
        let posts = []
        const aliases = users.map((user) => {
          return user.alias
        })

        firebase
          .firestore()
          .collection('posts')
          .orderBy('createdAt')
          .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
              const postData = change.doc.data()

              if (!aliases.includes(postData.alias)) {
                return
              }

              if (change.type === 'added') {
                posts.unshift({
                  ...postData,
                  id: change.doc.id,
                  photoUrl: users.find((user) => user.alias === postData.alias).photoUrl
                })
              } else if (change.type === 'removed') {
                posts = posts.filter((post) => post.id !== change.doc.id)
              }
            })

            commit('setPosts', posts)
            resolve()
          })
      })
    },
    addPost(ctx, { content, user }) {
      return firebase
        .firestore()
        .collection('posts')
        .add({
          alias: user,
          content,
          createdAt: Date.now()
        })
    },
    removePost(ctx, id) {
      return firebase
        .firestore()
        .collection('posts')
        .doc(id)
        .delete()
    }
  }
}
