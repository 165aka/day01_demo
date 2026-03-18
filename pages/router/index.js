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
// router/index.js
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')
  
  if (authRequired && !loggedIn) {
    next('/login')
  } else {
    next()
  }
})