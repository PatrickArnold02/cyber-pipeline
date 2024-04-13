// Libraries
import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import DistrictView from '../views/DistrictView.vue'
import TeacherView from '../views/TeacherView.vue'
import UserView from '../views/UserView.vue'
import CohortView from '../views/CohortView.vue'

// Stores
import { useTokenStore } from '@/stores/Token'

/**
 * Route guard to confirm the user is an administrator
 *
 * @returns Boolean: true if the user is an admin, otherwise false
 */
const requireAdmin = () => {
  const tokenStore = useTokenStore()
  return tokenStore.is_admin
}

/**
 * Router factory method
 */
const router = createRouter({
  // Enable virtual history
  history: createWebHistory(import.meta.env.BASE_URL),

  // List of routes
  routes: [
    // Homepage
    {
      path: '/',
      name: 'home',
      component: HomeView
    },

    // Profile page
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },

    // Teachers page
    {
      path: '/teachers',
      name: 'teachers',
      component: TeacherView,
      beforeEnter: requireAdmin
    },

    // Districts page
    {
      path: '/districts',
      name: 'districts',
      component: DistrictView,
      beforeEnter: requireAdmin
    },

    // Cohorts page
    {
      path: '/cohorts',
      name: 'cohorts',
      component: CohortView,
      beforeEnter: requireAdmin
    },

    // Users page
    {
      path: '/users',
      name: 'users',
      component: UserView,
      beforeEnter: requireAdmin
    }
  ]
})

/**
 * Global route guard - user must be logged in to view any page other than home
 */
router.beforeEach(async function (to) {
  if (to.name !== 'home') {
    const tokenStore = useTokenStore()
    if (!tokenStore.token) {
      await tokenStore.getToken()
    }
    if (!tokenStore.token) {
      return '/'
    }
  }
})

export default router
