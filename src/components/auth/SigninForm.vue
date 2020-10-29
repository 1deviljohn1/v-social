<template>
  <form @submit.prevent="authUser" class="white col s12">
    <div class="row">
      <div class="input-field col s12">
        <i class="material-icons prefix">account_circle</i>
        <i
          class="tooltipped material-icons prefix prefix-right grey-text"
          data-position="top"
          ref="tooltip"
          :data-tooltip="aliasRule | convertAuthCode"
          >info_outline</i
        >
        <input id="signin_alias" type="text" v-model.trim="alias" />
        <label for="signin_alias">Псевдоним</label>
      </div>

      <div class="input-field col s12">
        <i class="material-icons prefix">date_range</i>
        <input readonly class="datepicker" id="signin_dob" type="text" ref="datepicker" v-model.lazy="dob" />
        <label for="signin_dob">Дата рождения</label>
      </div>

      <div class="input-field col s12">
        <i class="material-icons prefix">place</i>
        <select ref="select" v-model="select">
          <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
        </select>
        <label>Страна</label>
      </div>

      <div class="input-field col s12">
        <i class="material-icons prefix">email</i>
        <input id="signin_email" type="text" v-model.trim="email" />
        <label for="signin_email">Эл. почта</label>
      </div>

      <div class="input-field col s12">
        <i class="material-icons prefix">lock</i>
        <i @click="showPassword = !showPassword" class="material-icons prefix prefix-right grey-text">{{ togglePassword }}</i>
        <input id="signin_password" :type="showPassword ? 'text' : 'password'" v-model.trim="password" />
        <label for="signin_password">Пароль</label>
      </div>

      <p v-if="authCode" class="center red-text">
        {{ authCode | convertAuthCode }}
      </p>

      <div class="input-field col s12">
        <button class="btn waves-effect waves-light" type="submit">
          Присоединиться
        </button>
        <a @click="toggleForm" class="btn-flat ttn">Войти в акканут</a>
      </div>
    </div>
  </form>
</template>

<script>
import M from 'materialize-css'
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SigninForm',
  data() {
    return {
      alias: '',
      dob: '',
      email: '',
      password: '',
      showPassword: false,
      aliasRule: 'auth/alias-format',
      select: 'Россия',
      countries: []
    }
  },
  methods: {
    ...mapActions(['createUser', 'isAliasAvailable']),
    ...mapMutations(['setAuthCode', 'setLoading']),
    async authUser() {
      this.setLoading(true)
      this.setAuthCode('')

      if (!this.alias || !this.dob || !this.email || !this.password || !this.select) {
        this.setAuthCode('auth/empty-data')
        this.setLoading(false)
        return
      }

      if (!this.validAlias(this.alias)) {
        this.setAuthCode('auth/invalid-alias')
        this.setLoading(false)
        return
      }

      if (!(await this.isAliasAvailable(this.alias))) {
        this.setAuthCode('auth/alias-already-in-use')
        this.setLoading(false)
        return
      }

      const authData = {
        alias: this.alias,
        dob: this.dob,
        country: this.select,
        email: this.email,
        password: this.password
      }

      this.createUser(authData).then(() => {
        this.setLoading(false)
      })
    },
    validAlias(alias) {
      const aliasRegExp = /^[a-zA-Z0-9]*$/
      return aliasRegExp.test(alias)
    },
    toggleForm() {
      this.$emit('toggleForm')
    }
  },
  computed: {
    ...mapGetters(['authCode']),
    togglePassword() {
      return this.showPassword ? 'visibility_on' : 'visibility_off'
    }
  },
  created() {
    this.countries = Object.values(require('@/assets/data/countries.json'))
  },
  mounted() {
    M.FormSelect.init(this.$refs.select)
    M.Tooltip.init(this.$refs.tooltip)
    M.Datepicker.init(this.$refs.datepicker, {
      yearRange: [1950, new Date().getFullYear()],
      maxDate: new Date(),
      format: 'dd.mm.yyyy',
      i18n: {
        cancel: 'Отменить',
        done: 'Выбрать',
        months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
        monthsShort: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
        weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
        weekdaysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
        weekdaysAbbrev: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
      }
    })
  }
}
</script>
