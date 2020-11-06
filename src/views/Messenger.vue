<template>
  <div class="messenger">
    <ComponentLoader v-if="isComponentLoading" />
    <div v-else class="card">
      <div v-if="users.length" class="card-content">
        <div class="users-list">
          <div
            class="user"
            :class="{ selected: user.alias === selectedChat }"
            @click="openChat(user.alias)"
            v-for="user in users"
            :key="user.id"
          >
            <Badge :photoUrl="user.photoUrl" :alias="user.alias" :invertColor="true" />
            <p class="center-align">{{ user.alias }}</p>
          </div>
        </div>
        <div v-if="!selectedChat" class="users-messages">
          <img :src="require('@/assets/images/empty_icon.png')" alt="" />
          <p>Выберите чат</p>
        </div>
        <Messages v-else :messages="messages" :destination="selectedChat" />
      </div>
      <div v-else class="card-content no-messages">
        <img :src="require('@/assets/images/empty_icon.png')" alt="" />
        <p>У вас пока нет сообщений</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Badge from '@/components/common/Badge'
import ComponentLoader from '@/components/common/ComponentLoader'
import Messages from '@/components/common/Messages'

export default {
  name: 'Messenger',
  data() {
    return {
      users: [],
      aliases: [],
      isComponentLoading: false,
      selectedChat: false
    }
  },
  components: {
    Badge,
    ComponentLoader,
    Messages
  },
  computed: {
    ...mapGetters(['currentUserData', 'messages'])
  },
  methods: {
    ...mapActions(['fetchUsersFromMessages', 'fetchUsers', 'fetchMessages']),
    async openChat(alias) {
      this.selectedChat = alias

      const chatMembers = {
        from: this.currentUserData.alias,
        to: alias
      }

      await this.fetchMessages(chatMembers)
    }
  },
  async mounted() {
    this.isComponentLoading = true
    this.aliases = await this.fetchUsersFromMessages()
    if (this.aliases.length) {
      this.users = await this.fetchUsers(this.aliases)
    }
    this.isComponentLoading = false
  }
}
</script>

<style lang="scss">
.messenger {
  .messages-wrapper {
    padding: 20px;
  }

  .card {
    height: calc(100vh - 100px);

    .card-content {
      padding: 0;
      display: flex;
      height: 100%;

      &.no-messages {
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 40px;
      }
    }

    .users-list {
      display: flex;
      flex-direction: column;
      border-right: 1px solid $secondary_text;

      .user {
        cursor: pointer;
        padding: 20px 40px;
        border-bottom: 1px solid $secondary_text;

        &:last-child {
          border: 0;
        }

        &.selected {
          background: $active_color_bg;
        }
      }
    }

    .users-messages {
      flex: 1;
      flex-direction: column;
      justify-content: center;
      display: flex;
      align-items: center;
    }
  }
}
</style>
