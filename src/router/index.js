import Vue from 'vue'
import VueRouter from 'vue-router'
import StaffView from '../views/StaffView.vue'
import ClienteView from '../views/ClienteView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: StaffView
  },
  {
    path: '/cliente',
    name: 'cliente',
    component: ClienteView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
