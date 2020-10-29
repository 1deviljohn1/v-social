<template>
  <div class="users">
    <ComponentLoader v-if="isComponentLoading" />
    <div v-else class="card">
      <div class="card-content">
        <UsersList v-if="users.length" :users="users" :badgeSize="100" :showIcon="true" />
        <div v-else class="users-empty flex-center center-align">
          <img :src="require('@/assets/images/users-empty.svg')" alt="" />
          <h6>Других пользователей пока нет. Вы нулевой пациент</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ComponentLoader from '@/components/common/ComponentLoader'
import UsersList from '@/components/common/UsersList'

export default {
  name: 'Users',
  components: {
    ComponentLoader,
    UsersList
  },
  data() {
    return {
      users: [],
      isComponentLoading: false
    }
  },
  methods: {
    ...mapActions(['fetchUsers'])
  },
  computed: {
    ...mapGetters(['currentUserData'])
  },
  async mounted() {
    this.isComponentLoading = true
    this.users = await this.fetchUsers([])
    this.users = this.users.filter((user) => user.alias !== this.currentUserData.alias)
    this.isComponentLoading = false
  }
}
</script>

<style lang="scss">
.users {
  &-empty {
    flex-direction: column;

    img {
      width: 200px;
      margin-bottom: 30px;
    }
  }
}
</style>
