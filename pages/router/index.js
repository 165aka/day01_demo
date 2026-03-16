// router/index.js
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home.vue')
  }
]