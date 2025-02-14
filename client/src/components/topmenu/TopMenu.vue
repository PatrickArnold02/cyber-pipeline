<script setup>
// Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// PrimeVue Components
import Menubar from 'primevue/menubar'


// Custom Components
import ThemeToggle from '@/components/topmenu/ThemeToggle.vue'
import LoginProfile from '@/components/topmenu/LoginProfile.vue'
import { useToast } from 'primevue/usetoast'
const toast = useToast()

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

import { useCohortsStore } from '@/stores/Cohorts.js'
import { useCoursesStore } from '@/stores/Courses.js'
import { useUsersStore } from '@/stores/Users.js'
import { useDistrictsStore } from '@/stores/Districts.js'
import { useTeachersStore } from '@/stores/Teachers.js'
import { useEnrollmentStore } from '@/stores/Enrollment.js'
import { useRolesStore } from '@/stores/Roles.js'
import { useCanvasStore } from '@/stores/Canvas.js'

const cohortsStore = useCohortsStore()
const coursesStore = useCoursesStore()
const usersStore = useUsersStore()
const districtsStore = useDistrictsStore()
const teacherStore = useTeachersStore()
const enrollmentStore = useEnrollmentStore()
const rolesStore = useRolesStore()
const canvasStore = useCanvasStore()

const testCanvasAPI = async () => {
  toast.add({
    severity: 'info',
    summary: 'Testing API Connection',
    detail: 'Trying to pull all courses from the Canvas API',
    life: 3000
  })

  const response = await canvasStore.getCourses()

  if(response.status != 200){
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to pull all courses from the Canvas API',
      life: 3000
    })
  } else if(response.status == 200) {
    toast.add({
      severity: 'success',
      summary: 'API Connection Successful',
      detail: 'Successfully pulled all courses from the Canvas API',
      life: 3000
    })
  }
}

/**
 * Rehydrates all the stores, slightly faster than fully refreshing the page
 */
const syncWithDatabase = async () => {
  try{
    toast.add({
      severity: 'info',
      summary: 'Syncing with Database',
      detail: 'Please wait...',
      life: 3000
    })

    await cohortsStore.hydrate()
    await coursesStore.hydrate()
    await usersStore.hydrate()
    await districtsStore.hydrate()
    await teacherStore.hydrate()
    await enrollmentStore.hydrate()
    await rolesStore.hydrate()

    toast.add({
      severity: 'success',
      summary: 'Synced with Database',
      detail: 'All stores have been hydrated',
      life: 3000
    })
  } catch(error){
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to sync with database',
      life: 3000
    })
  }  
}

// Menu items
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push({ name: 'home' })
    }
  }
])

/**
 * Watch for changes in token and update menu
 */
tokenStore.$subscribe(() => {
  // All users render these fields
  if (tokenStore.is_user || tokenStore.is_admin) {
    items.value = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          router.push({ name: 'home' })
        }
      },
      {
        label: 'Teachers',
        icon: 'pi pi-users',
        command: () => {
          router.push({ name: 'teachers' })
        }
      },
      {
        label: 'Districts',
        icon: 'pi pi-building',
        command: () => {
          router.push({ name: 'districts' })
        }
      }
    ]
  }
  if (tokenStore.is_admin) {
    items.value.push(
      {
        label: 'Cohorts',
        icon: 'pi pi-users',
        command: () => {
          router.push({ name: 'cohorts' })
        }
      },
      {
        label: 'Courses',
        icon: 'pi pi-book',
        command: () => {
          router.push({ name: 'courses' })
        }
      },
      {
        label: 'Users',
        icon: 'pi pi-user-edit',
        command: () => {
          router.push({ name: 'users' })
        }
      },
      {
        label: 'Mailing',
        icon: 'pi pi-envelope',
        command: () => {
          router.push({ name: 'mailing'})
        }
      },
      {
        label: 'Analytics',
        icon: 'pi pi-sliders-h',
        command: () => {
          router.push({ name: 'analytics' })  
        }
      },
      {
        label: 'Sync',
        icon: 'pi pi-refresh',
        command: () => {
          syncWithDatabase()
        }
      },
      {
        label: 'Test API Connection',
        icon: 'pi pi-cloud',
        command: () => {
          testCanvasAPI()
        }
      }
    )
  }
})
</script>

<template>
  <Menubar :model="items">
    <template #start>
      <RouterLink :to="{ name: 'home' }">
        <img
          src="../../assets/logo.png"
          height="46px"
          alt="CyberPipeline Logo"
        />
      </RouterLink>
    </template>
    <template #end>
      <div class="flex align-items-center gap-2">
        <ThemeToggle /> 
        <LoginProfile />
      </div>
    </template>
  </Menubar>
</template>

<style scoped></style>
