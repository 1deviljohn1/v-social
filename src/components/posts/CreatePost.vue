<template>
  <div class="card create-post">
    <div class="card-content">
      <form ref="post-form" class="flex-center">
        <Badge :alias="profileUserData.alias" :photoUrl="profileUserData.photoUrl" :invertColor="true" />
        <div class="input-field post-field">
          <textarea id="new-post" class="materialize-textarea" v-model.trim="newPost" />
          <label for="new-post">Что у тебя нового?</label>
        </div>
        <a :disabled="!newPost.length" @click="sendPost" class="btn-flat"><i class="material-icons">send</i></a>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import M from 'materialize-css'
import Badge from '@/components/common/Badge'

export default {
  name: 'CreatePost',
  props: ['profileUserData'],
  data() {
    return {
      newPost: ''
    }
  },
  components: {
    Badge
  },
  methods: {
    ...mapActions(['addPost']),
    ...mapMutations(['setLoading']),
    sendPost() {
      this.setLoading(true)

      const postData = {
        content: this.newPost.replace(/\n\r?/g, '<br />'),
        user: this.profileUserData.alias
      }

      this.addPost(postData).then(() => {
        this.newPost = ''
        this.$refs['post-form'].reset()
        M.textareaAutoResize(this.$refs['post-form'].elements[0])
        this.setLoading(false)
      })
    }
  },
  mounted() {
    M.updateTextFields()
  }
}
</script>

<style lang="scss">
.card.create-post {
  margin-bottom: 70px;

  .post-field {
    margin-left: 20px;
    flex: 1;
  }

  .card-content {
    padding-top: 10px;
    padding-bottom: 0;
  }
}
</style>
