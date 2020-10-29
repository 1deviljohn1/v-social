import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

import Auth from '@/views/Auth'
import Profile from '@/views/Profile'
import Home from '@/views/Home'
import Users from '@/views/Users'
import Chat from '@/views/Chat'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requireAuth: true }
  },
  {
    path: '/user/:alias',
    name: 'Profile',
    component: Profile,
    meta: { requireAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requireAuth: true }
  },
  {
    path: '/chat/:alias',
    name: 'Chat',
    component: Chat,
    meta: { requireAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    beforeEnter: (to, from, next) => {
      const currentUser = firebase.auth().currentUser
      currentUser ? next({ name: 'Home' }) : next()
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requireAuth = to.matched.some((record) => record.meta.requireAuth)
  requireAuth && !currentUser ? next({ name: 'Auth' }) : next()
})

export default router
