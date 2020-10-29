<template>
  <div class="card-content">
    <div class="post-header flex-center">
      <div class="post-header-badge">
        <Badge v-if="post" :alias="post.alias" :photoUrl="post.photoUrl" :invertColor="true" />
      </div>
      <div class="post-header-info">
        <strong>{{ post.alias }}</strong>
        <p class="post-header-time">{{ post.createdAt | formatDatetimeFromNow }}</p>
      </div>

      <!-- Actions -->
      <div v-if="isCurrentUser" class="post-actions">
        <a :data-target="`post-actions${post.id}`" class="post-delete waves-effect waves-teal btn-flat">
          <i class="material-icons">more_vert</i>
        </a>
        <ul :id="`post-actions${post.id}`" class="dropdown-content">
          <li>
            <a @click="deletePost"><i class="material-icons">delete</i>Удалить</a>
          </li>
        </ul>
      </div>
      <!-- Actions -->
    </div>
    <p v-html="post.content"></p>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import M from 'materialize-css'
import Badge from '@/components/common/Badge'

export default {
  name: 'Post',
  props: ['post', 'isCurrentUser'],
  components: {
    Badge
  },
  methods: {
    ...mapActions(['removePost']),
    ...mapMutations(['setLoading']),
    deletePost() {
      this.setLoading(true)
      this.removePost(this.post.id).then(() => {
        this.setLoading(false)
      })
    }
  },
  mounted() {
    M.Dropdown.init(document.querySelectorAll('.post-delete'), {
      coverTrigger: false,
      constrainWidth: false
    })
  }
}
</script>

<style lang="scss">
.post-header {
  margin-bottom: 30px;

  &-badge {
    margin-right: 20px;
  }

  &-time {
    @extend %secondary_font;
  }
}

.post-actions {
  margin-left: auto;
}
</style>
