<template>
  <div class="navbar-fixed">
    <!-- Dropdown Structure -->
    <ul id="navbar-actions" class="dropdown-content">
      <li>
        <a @click.prevent="signOut"><i class="material-icons">exit_to_app</i>Выйти</a>
      </li>
    </ul>
    <!-- Dropdown Structure -->
    <nav>
      <div class="nav-wrapper">
        <img src="@/assets/images/logo-white.svg" alt="" />
        <ul class="right">
          <li>
            <a class="avatar flex-center" ref="navbar-actions" data-target="navbar-actions">
              <span>{{ currentUserData.alias }}</span>
              <Badge :alias="currentUserData.alias" :photoUrl="currentUserData.photoUrl" />
              <i class="material-icons right">arrow_drop_down</i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import M from 'materialize-css'
import Badge from '@/components/common/Badge'

export default {
  name: 'Navbar',
  data() {
    return {
      user: {}
    }
  },
  components: {
    Badge
  },
  methods: {
    ...mapActions(['logoutUser']),
    signOut() {
      this.logoutUser()
    }
  },
  computed: {
    ...mapGetters(['currentUserData'])
  },
  mounted() {
    M.Dropdown.init(this.$refs['navbar-actions'], {
      coverTrigger: false
    })
  }
}
</script>

<style lang="scss" scoped>
nav {
  background: $main_color;
  padding: 0 40px;

  .avatar {
    span {
      margin-right: 20px;
    }
  }
}
</style>
