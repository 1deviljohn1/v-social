<template>
  <div class="auth">
    <img class="auth-logo" src="@/assets/images/logo-main.svg" alt="" />

    <div class="card">
      <div class="card-content">
        <LoginForm v-if="login" @toggleForm="toggleForm" />
        <SigninForm v-else @toggleForm="toggleForm" />
      </div>
    </div>

    <blockquote v-if="usersCount">Зарегистрировано пользователей: {{ usersCount }}</blockquote>
  </div>
</template>

<script>
import M from 'materialize-css'
import LoginForm from '@/components/auth/LoginForm'
import SigninForm from '@/components/auth/SigninForm'
import { mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Auth',
  data() {
    return {
      login: true
    }
  },
  components: {
    LoginForm,
    SigninForm
  },
  methods: {
    ...mapMutations(['setAuthCode']),
    ...mapActions(['fetchUsersCount']),
    toggleForm() {
      this.login = !this.login
      this.setAuthCode('')
    }
  },
  computed: {
    ...mapGetters(['usersCount'])
  },
  mounted() {
    this.fetchUsersCount()
    M.updateTextFields()
  }
}
</script>

<style lang="scss">
.auth {
  max-width: 400px;
  margin: 200px auto;

  &-logo {
    display: block;
    margin: 0 auto 20px;
  }

  .row {
    margin-bottom: 0;
  }

  .prefix-right {
    right: 0;
    cursor: pointer;
    z-index: 1;
    font-size: 1.5rem;
    top: 1rem;
  }

  i {
    user-select: none;
  }

  .ttn {
    text-transform: none;
  }
}
</style>
