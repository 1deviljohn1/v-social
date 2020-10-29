<template>
  <div>
    <ComponentLoader v-if="isComponentLoading" />
    <div v-else class="profile" :class="{ 'first-user': userData.isFirstUser }">
      <div class="card profile-card">
        <div class="card-content">
          <div class="profile-image">
            <div class="profile-image-wrap">
              <img :src="profilePhoto" />
              <div v-if="isCurrentUser" class="image-upload flex-center modal-trigger" href="#profile-upload">
                <i class="material-icons medium">photo_camera</i>
              </div>
            </div>
            <div v-if="!isCurrentUser" class="profile-actions">
              <router-link :to="{ name: 'Chat', params: { alias: userData.alias } }">
                <button class="btn-small btn-actions">
                  <i class="material-icons right">message</i>
                  Чат
                </button>
              </router-link>
              <button @click="manageFollow(true)" v-if="!isSubscribed" class="btn-small btn-actions">
                <i class="material-icons right">check</i>
                Подписаться
              </button>
              <button v-else @click="manageFollow(false)" class="grey btn-small btn-actions">
                <i class="material-icons right">clear</i>
                Отписаться
              </button>
            </div>
          </div>
          <div class="profile-content">
            <strong class="profile-title">{{ userData.alias }}</strong>
            <form v-if="statusEdit" @submit.prevent="saveInfo">
              <div class="input-field post-field">
                <textarea ref="textarea" class="materialize-textarea" v-model.trim="status" />
                <label for="new-post"></label>
              </div>

              <div class="input-field post-field">
                <button class="btn-small">Сохранить</button>
              </div>
            </form>
            <p v-else @click="prepareEdit" class="profile-status" :class="{ 'profile-status-edit': isCurrentUser }">
              <i v-if="isCurrentUser" class="material-icons">edit</i>
              <span v-html="userData.info || dummyInfo"></span>
            </p>
            <p v-if="userData.isFirstUser" class="profile-info red-text">
              <i class="material-icons">star</i>нулевой пациент
            </p>
            <p class="profile-info grey-text">
              <i class="material-icons">person_outline</i>{{ userData.createdAt | formatDate }}
            </p>
            <p class="profile-info grey-text"><i class="material-icons">cake</i>{{ userData.dob }}</p>
            <p class="profile-info grey-text"><i class="material-icons">place</i>{{ userData.country }}</p>
            <p class="profile-info grey-text"><i class="material-icons">email</i>{{ userData.email }}</p>
          </div>
        </div>
      </div>

      <!-- Posts -->
      <CreatePost v-if="isCurrentUser" :profileUserData="{ ...profileUserData, photoUrl: userData.photoUrl }" />

      <div class="card" v-for="post in posts" :key="post.id">
        <Post :isCurrentUser="isCurrentUser" :post="{ ...post, photoUrl: userData.photoUrl }" />
      </div>
      <!-- Posts -->
    </div>
    <!-- Upload modal -->
    <div ref="profile-upload" id="profile-upload" class="modal profile-upload">
      <div class="modal-content">
        <p class="flex-center grey-text text-darken-1">
          <i class="material-icons">info_outline</i> Загрузите изображение в формате
          {{ allowedImages.join(' или ') }} размером не более {{ maxFileSizeKb }} Кб
        </p>
        <p v-if="uploadError" class="red-text">Фото не отвечает требованиям</p>
        <button @click="$refs.file.click()" class="btn">Загрузить</button>
        <input ref="file" type="file" @change="pickupProfileImage" />
      </div>
    </div>
    <!-- Upload modal -->
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import CreatePost from '@/components/posts/CreatePost'
import Post from '@/components/posts/Post'
import ComponentLoader from '@/components/common/ComponentLoader'
import M from 'materialize-css'

export default {
  name: 'Profile',
  data() {
    return {
      isComponentLoading: false,
      statusEdit: false,
      status: '',
      modal: null,
      uploadError: false,
      maxFileSizeKb: 100,
      allowedImages: ['image/png', 'image/jpeg'],
      dummyInfo: 'Здесь будет какой-нибудь дурацкий текст до тех пор, пока я не расскажу о себе всему миру!!!'
    }
  },
  components: {
    CreatePost,
    Post,
    ComponentLoader
  },
  methods: {
    ...mapActions([
      'manageSubscription',
      'listenCurrentUserData',
      'fetchProfileUserData',
      'uploadProfileImage',
      'updateInfo',
      'fetchPosts'
    ]),
    ...mapMutations(['setLoading']),
    manageFollow(add) {
      const followData = {
        user: this.currentUserData,
        followedUser: this.userData.alias,
        add
      }
      this.manageSubscription(followData)
    },
    async prepareEdit() {
      if (this.isCurrentUser) {
        this.statusEdit = true
        await this.$nextTick()
        M.textareaAutoResize(document.querySelector('textarea'))
      }
    },
    saveInfo() {
      this.setLoading(true)

      const updateData = { info: this.status.replace(/\n\r?/g, '<br />'), user: this.profileUserData.alias }
      this.statusEdit = false
      this.updateInfo(updateData).then(() => {
        this.statusEdit = false
        this.setLoading(false)
      })
    },
    async pickupProfileImage(e) {
      const file = e.target.files[0]
      this.uploadError = false

      if (!file || !file.size || file.size / 1024 > 100 || !this.allowedImages.includes(file.type)) {
        this.uploadError = true
        return false
      }

      const metadata = {
        contentType: file.type
      }

      this.modal.close()
      this.setLoading(true)
      const uploadData = { file, metadata, user: this.profileUserData.alias }

      await this.uploadProfileImage(uploadData)

      this.setLoading(false)
    }
  },
  computed: {
    ...mapGetters(['profileUserData', 'currentUserData', 'posts']),
    isCurrentUser() {
      return this.profileUserData.alias === this.currentUserData.alias
    },
    isSubscribed() {
      const subscriptionsArr = Object.values(this.currentUserData.subscriptions)
      return subscriptionsArr.includes(this.userData.alias)
    },
    userData() {
      return this.profileUserData.alias === this.currentUserData.alias ? this.currentUserData : this.profileUserData
    },
    profilePhoto() {
      return this.userData.photoUrl ? this.userData.photoUrl : require('@/assets/images/placeholder-photo.svg')
    }
  },
  async mounted() {
    this.isComponentLoading = true

    this.modal = M.Modal.init(this.$refs['profile-upload'])
    const profileAlias = this.$route.params.alias

    this.listenCurrentUserData(this.currentUserData.alias)
    await this.fetchProfileUserData(profileAlias)
    await this.fetchPosts([this.profileUserData])

    this.status = this.userData.info
    this.isComponentLoading = false
  }
}
</script>

<style lang="scss">
.profile {
  &.first-user {
    .card.profile-card {
      background: $white_color url('../assets/images/bat.svg');
      background-size: 50px;
    }
  }
  .card.profile-card {
    padding-right: 20px;

    > .card-content {
      display: flex;
    }

    .profile-content {
      flex: 1;
    }

    .profile-title {
      font-weight: bold;
      font-size: 2rem;
    }

    .profile-status {
      position: relative;
      font-size: 16px;
      line-height: normal;
      margin: 30px 0;

      &-edit {
        cursor: pointer;
      }

      &:hover {
        i {
          opacity: 1;
        }
      }

      i {
        position: absolute;
        transition: opacity 0.4s ease;
        right: -30px;
        opacity: 0;
      }
    }

    .profile-info {
      @extend %secondary_font;
      display: flex;
      margin-bottom: 3px;

      i {
        margin-right: 10px;
      }
    }

    .profile-image {
      margin-right: 50px;

      .btn-actions {
        margin: 20px auto 0;
        display: block;
        padding: 0 12px;
        font-size: 12px;
        width: 100%;
      }

      &-wrap {
        position: relative;
        overflow: hidden;

        &:hover {
          .image-upload {
            opacity: 1;
          }
        }
      }

      .image-upload {
        cursor: pointer;
        transition: opacity 0.4s ease;
        opacity: 0;
        justify-content: center;
        background: $opacity_bg;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }

      img {
        width: 150px;
        height: 150px;
        border-radius: 100%;
        object-fit: cover;
      }
    }
  }
}

.modal.profile-upload {
  button {
    margin-top: 20px;
  }

  input {
    display: none;
  }

  i {
    margin-right: 10px;
  }
}
</style>
