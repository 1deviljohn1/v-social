<template>
  <div id="app">
    <Loader v-if="isLoading" />

    <div v-if="$route.name === 'Auth'">
      <router-view />
    </div>

    <div v-else>
      <Nabvar />
      <div class="container">
        <div class="row">
          <div class="col s3">
            <Sidenav />
            <Subscriptions :key="currentUserData.subscriptions.length" v-if="currentUserData.subscriptions.length" />
          </div>
          <div class="col s9">
            <router-view :key="$route.fullPath" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '@/components/common/Loader'
import Nabvar from '@/components/common/Navbar'
import Sidenav from '@/components/common/Sidenav'
import Subscriptions from '@/components/common/Subscriptions'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Loader,
    Nabvar,
    Sidenav,
    Subscriptions
  },
  computed: {
    ...mapGetters(['isLoading', 'currentUserData'])
  }
}
</script>
