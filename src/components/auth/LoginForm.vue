<template>
  <form @submit.prevent="authUser" class="white col s12">
    <div class="row">
      <div class="input-field col s12">
        <i class="material-icons prefix">email</i>
        <input id="login_email" type="text" v-model.trim="email" />
        <label for="login_email">Эл. почта</label>
      </div>

      <div class="input-field col s12">
        <i class="material-icons prefix">lock</i>
        <i @click="showPassword = !showPassword" class="material-icons prefix prefix-right grey-text">{{ togglePassword }}</i>
        <input id="login_password" :type="showPassword ? 'text' : 'password'" v-model.trim="password" />
        <label for="login_password">Пароль</label>
      </div>

      <p v-if="authCode" class="center red-text">
        {{ authCode | convertAuthCode }}
      </p>

      <div class="input-field col s12">
        <button class="btn waves-effect waves-light" type="submit">
          Войти
        </button>
        <a @click="toggleForm" class="btn-flat ttn">Ты еще не с нами?</a>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false
    }
  },
  methods: {
    ...mapActions(['loginUser']),
    ...mapMutations(['setAuthCode', 'setLoading']),
    toggleForm() {
      this.$emit('toggleForm')
    },
    authUser() {
      if (this.email && this.password) {
        this.setAuthCode('')
        this.setLoading(true)

        const authData = {
          email: this.email,
          password: this.password
        }

        this.loginUser(authData).then(() => {
          this.setLoading(false)
        })
      } else {
        this.setAuthCode('auth/empty-data')
      }
    }
  },
  computed: {
    ...mapGetters(['authCode']),
    togglePassword() {
      return this.showPassword ? 'visibility_on' : 'visibility_off'
    }
  }
}
</script>
