import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'todos',
      component: () => import('../views/TodosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to) => {
  const { session, initialized } = useAuth()

  // Wait for the initial getSession() call to resolve so a page refresh
  // doesn't briefly bounce an authenticated user to /login.
  if (!initialized.value) {
    await new Promise<void>((resolve) => {
      const stop = setInterval(() => {
        if (initialized.value) {
          clearInterval(stop)
          resolve()
        }
      }, 20)
    })
  }

  const isAuthenticated = !!session.value

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && isAuthenticated) {
    return { name: 'todos' }
  }

  return true
})

export default router
