<template>
  <div>
    <ComponentLoader v-if="isComponentLoading" />
    <div v-else class="chat card">
      <div class="card-content">
        <div class="chat-empty flex-center" v-if="!messages.length">
          <img :src="require('@/assets/images/chat-empty.svg')" alt="" />
          <p>Сообщений пока нет</p>
        </div>
        <div v-else class="messages" v-chat-scroll="{ smooth: true, notSmoothOnInit: true }">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ incoming: isIncomingMessage(message) }"
          >
            <div class="message-content">
              <p
                v-if="!isIncomingMessage(message)"
                @click="deleteMessage(message.id)"
                class="message-actions right-align"
              >
                Удалить
              </p>
              <p class="message-text">{{ message.message }}</p>
              <p class="message-time right-align">{{ message.createdAt | formatDatetime }}</p>
            </div>
          </div>
        </div>
        <form @submit.prevent="submitMessage" ref="message-form" class="flex-center message-form">
          <div class="input-field message-field">
            <input id="new-message" type="text" v-model.trim="message" />
            <label for="new-message">Сообщение</label>
          </div>
          <a :disabled="!message.length" @click="submitMessage" class="btn-flat"><i class="material-icons">send</i></a>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import M from 'materialize-css'
import ComponentLoader from '@/components/common/ComponentLoader'

export default {
  name: 'Chat',
  data() {
    return {
      message: '',
      isComponentLoading: false
    }
  },
  components: {
    ComponentLoader
  },
  computed: {
    ...mapGetters(['currentUserData', 'messages'])
  },
  methods: {
    ...mapActions(['sendMessage', 'fetchMessages', 'removeMessage']),
    isIncomingMessage(message) {
      return message.from !== this.currentUserData.alias
    },
    submitMessage() {
      if (!this.message) {
        return
      }

      const messageData = {
        message: this.message,
        from: this.currentUserData.alias,
        to: this.$route.params.alias
      }

      this.message = ''
      this.$refs['message-form'].reset()

      this.sendMessage(messageData).then(() => {
        M.updateTextFields()
      })
    },
    deleteMessage(message) {
      this.removeMessage(message)
    }
  },
  async mounted() {
    this.isComponentLoading = true

    M.updateTextFields()

    const chatMembers = {
      from: this.currentUserData.alias,
      to: this.$route.params.alias
    }

    await this.fetchMessages(chatMembers)
    this.isComponentLoading = false
  }
}
</script>

<style lang="scss">
.chat.card {
  margin-bottom: 0;
  height: calc(100vh - 100px);

  .chat-empty {
    flex-direction: column;

    img {
      width: 100px;
      height: 100px;
    }
  }

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .chat-empty {
    flex: 1;
    justify-content: center;
  }

  .messages {
    flex: 1;
    overflow-y: scroll;
    padding: 0 20px;
  }

  .message-form {
    margin-top: 20px;
  }

  .message {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-end;

    &-content {
      max-width: 75%;
    }

    &.incoming {
      justify-content: flex-start;

      .message-text {
        background: $main_color_bg;

        &::after {
          display: none;
        }

        &::before {
          content: '';
          position: absolute;
          left: -8px;
          bottom: 50%;
          transform: translateY(50%);
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-right-color: $main_color_bg;
          border-left-width: 0;
        }
      }
    }

    &-text {
      position: relative;
      background: $main_color_lighten2;
      border-radius: 4px;
      padding: 10px;

      &::after {
        content: '';
        position: absolute;
        right: -8px;
        bottom: 50%;
        transform: translateY(50%);
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-right-width: 0;
        border-left-color: $main_color_lighten2;
      }
    }

    &-time {
      @extend %secondary_font;
    }

    &-actions {
      @extend %secondary_font;
      cursor: pointer;
    }
  }

  .message-field {
    flex: 1;
  }

  ::-webkit-scrollbar {
    width: 2px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: $main_color;
  }
}
</style>
