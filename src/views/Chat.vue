<template>
  <div>
    <ComponentLoader v-if="isComponentLoading" />
    <div v-else class="chat card">
      <div class="card-content">
        <Messages :messages="messages" :destination="this.$route.params.alias" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ComponentLoader from '@/components/common/ComponentLoader'
import Messages from '@/components/common/Messages'

export default {
  name: 'Chat',
  data() {
    return {
      isComponentLoading: false
    }
  },
  components: {
    ComponentLoader,
    Messages
  },
  computed: {
    ...mapGetters(['currentUserData', 'messages'])
  },
  methods: {
    ...mapActions(['fetchMessages'])
  },
  async mounted() {
    this.isComponentLoading = true

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

  .card-content {
    height: 100%;
  }
}
</style>
