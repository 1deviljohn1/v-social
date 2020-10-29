<template>
  <div class="messages">
    <ComponentLoader v-if="isComponentLoading" />
    <div v-else class="card">
      <div class="card-content">
        <div class="users-list">
          <div class="user" @click="openChat(user.alias)" v-for="user in users" :key="user.id">
            <Badge :size="100" :photoUrl="user.photoUrl" :alias="user.alias" :invertColor="true" />
            <p class="center-align">{{ user.alias }}</p>
          </div>
        </div>
        <div class="users-messages">
          <img :src="require('@/assets/images/empty_icon.png')" alt="" />
          <p>Выберите чат</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Badge from '@/components/common/Badge'
import ComponentLoader from '@/components/common/ComponentLoader'

export default {
  name: 'Messages',
  data() {
    return {
      users: [],
      aliases: [],
      isComponentLoading: false
    }
  },
  components: {
    Badge,
    ComponentLoader
  },
  methods: {
    ...mapActions(['fetchUsersFromMessages', 'fetchUsers']),
    openChat(alias) {
      console.log(alias)
    }
  },
  async mounted() {
    this.isComponentLoading = true
    this.aliases = await this.fetchUsersFromMessages()
    this.users = await this.fetchUsers(this.aliases)
    this.isComponentLoading = false
  }
}
</script>

<style lang="scss">
.messages {
  .card {
    .card-content {
      padding: 0;
      display: flex;
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
