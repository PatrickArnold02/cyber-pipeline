<script setup>
// Libraries
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// PrimeVue Components
import Menu from 'primevue/menu'
import Avatar from 'primevue/avatar'

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Menu Items
const items = ref([
  {
    label: 'Profile',
    icon: 'pi pi-cog',
    command: () => {
      router.push({ name: 'profile' })
    }
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: tokenStore.logout
  }
])

// Menu reference
const menu = ref()

/**
 * Toggle button handler
 *
 * @param {Event} event
 */
const toggle = (event) => {
  menu.value.toggle(event)
}

const visible = ref(false);
</script>

<template>
  <div class="p-menuitem">
    <!-- If no token present, show login button -->
    <div
      v-if="tokenStore.token == ''"
      class="p-menuitem-content"
    >
      <Button @click="visible = true" label="Login" icon="pi pi-sign-in"/>
    </div>

    <!-- If token present, assume user is logged in -->
    <div
      v-else
      class="p-menuitem-content"
    >
      <a
        class="p-menuitem-link"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="profile_menu"
      >
        <Avatar
          icon="pi pi-user"
          shape="circle"
        />
      </a>
      <Menu
        ref="menu"
        id="profile_menu"
        :model="items"
        :popup="true"
      />
    </div>
  </div>

  <Dialog :draggable="false" v-model:visible="visible" modal header="Log-in/Sign-up" :style="{ width: '25rem' }">
      <div class="flex items-center gap-6 mb-6">
          <Button label="Log-in" @click="tokenStore.getToken()"/>
      </div>
      <div class="flex items-center gap-6 mb-6">
          <Button label="Create an account"/>
      </div>
  </Dialog>
</template>
