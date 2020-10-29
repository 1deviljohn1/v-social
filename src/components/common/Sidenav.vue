<template>
  <div class="sidenav-static">
    <ul class="card collection">
      <router-link to="/" class="collection-item"><i class="material-icons">home</i>Новости</router-link>
      <router-link :to="{ name: 'Profile', params: { alias: currentUserData.alias } }" class="collection-item"
        ><i class="material-icons">account_circle</i>Профиль</router-link
      >
      <router-link to="/messages" class="collection-item"><i class="material-icons">chat</i>Мессенджер</router-link>
      <router-link to="/users" class="collection-item"><i class="material-icons">people</i>Люди</router-link>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Sidenav',
  computed: {
    ...mapGetters(['currentUserData'])
  }
}
</script>

<style lang="scss" scoped>
.collection {
  border: none;

  .collection-item {
    border-bottom: none;
    display: flex;
    padding: 20px;

    &:hover {
      background: #ccc;
    }

    i {
      margin-right: 20px;
    }
  }
}
</style>
