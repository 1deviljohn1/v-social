<template>
  <div class="subscriptions">
    <div class="card">
      <div class="card-content">
        <p class="subscriptions-title">Вы подписаны</p>
        <ComponentLoader v-if="isComponentLoading" />
        <UsersList v-else :users="users" columnSize="50%" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UsersList from '@/components/common/UsersList'
import ComponentLoader from '@/components/common/ComponentLoader'

export default {
  name: 'Subscriptons',
  components: {
    UsersList,
    ComponentLoader
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
    this.users = await this.fetchUsers(this.currentUserData.subscriptions)
    this.isComponentLoading = false
  }
}
</script>

<style lang="scss">
.subscriptions {
  .card {
    .subscriptions-title {
      margin-bottom: 20px;
    }
  }
}
</style>
