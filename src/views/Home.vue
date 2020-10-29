<template>
  <div>
    <ComponentLoader v-if="isComponentLoading" />
    <div v-else class="home">
      <CreatePost :profileUserData="{ ...currentUserData, photoUrl: currentUserData.photoUrl }" />

      <div class="card" v-for="post in posts" :key="post.id">
        <Post :isCurrentUser="post.alias === currentUserData.alias" :post="{ ...post, photoUrl: post.photoUrl }" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CreatePost from '@/components/posts/CreatePost'
import Post from '@/components/posts/Post'
import ComponentLoader from '@/components/common/ComponentLoader'

export default {
  name: 'Home',
  components: {
    CreatePost,
    Post,
    ComponentLoader
  },
  data() {
    return {
      isComponentLoading: false
    }
  },
  methods: {
    ...mapActions(['fetchPosts', 'fetchUsers'])
  },
  computed: {
    ...mapGetters(['currentUserData', 'posts'])
  },
  async mounted() {
    this.isComponentLoading = true

    let aliases = []
    aliases.push(this.currentUserData.alias)

    if (this.currentUserData.subscriptions.length) {
      aliases.push(...this.currentUserData.subscriptions)
    }

    const users = await this.fetchUsers(aliases)
    await this.fetchPosts(users)

    this.isComponentLoading = false
  }
}
</script>
