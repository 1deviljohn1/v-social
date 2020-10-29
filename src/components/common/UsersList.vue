<template>
  <div class="users-list">
    <router-link
      class="user-item black-text center-align"
      :style="style"
      v-for="user in users"
      :to="{ name: 'Profile', params: { alias: user.alias } }"
      :key="user.id"
    >
      <Badge
        :size="badgeSize"
        :alias="user.alias"
        :photoUrl="user.photoUrl"
        :invertColor="true"
        :followIcon="showIcon && isSubscribed(user.alias)"
        :firstUserIcon="showIcon && user.isFirstUser"
      />
      <p>{{ user.alias }}</p>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Badge from '@/components/common/Badge'

export default {
  name: 'UsersList',
  props: ['users', 'badgeSize', 'showIcon', 'columnSize'],
  components: {
    Badge
  },
  computed: {
    ...mapGetters(['currentUserData']),
    style() {
      return `flex-basis: ${this.columnSize}`
    }
  },
  methods: {
    isSubscribed(alias) {
      return this.currentUserData.subscriptions.includes(alias)
    }
  }
}
</script>

<style lang="scss">
.users-list {
  display: flex;
  flex-wrap: wrap;

  .user-item {
    flex-basis: 25%;
    margin-bottom: 50px;
  }
}
</style>
