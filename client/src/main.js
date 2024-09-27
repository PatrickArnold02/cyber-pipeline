// Libraries
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Logger from 'js-logger'

// PrimeVue Components
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import FocusTrap from 'primevue/focustrap'
import ConfirmationService from 'primevue/confirmationservice'

// Services
import setupInterceptors from './services/interceptors'

// Log messages will be written to the window's console.
Logger.useDefaults()
Logger.setLevel(import.meta.env.DEV ? Logger.DEBUG : Logger.WARN)
console.log('Log Level: ' + Logger.getLevel().name)

// CSS
import 'primeicons/primeicons.css'

// Themes are controlled in ThemeToggle.vue
// import 'primevue/resources/themes/aura-light-purple/theme.css'
// import 'primevue/resources/themes/aura-dark-purple/theme.css'
import 'primeflex/primeflex.css'

// App and Vue Router
import App from './App.vue'
import router from './router'

// Setup Axios Interceptors
setupInterceptors()

// Create App
const app = createApp(App)

// Configure Pinia
app.use(createPinia())

// Configure Vue Router
app.use(router)

// Configure PrimeVue
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'filled'
})
app.directive('tooltip', Tooltip)
app.directive('focustrap', FocusTrap)
app.use(ToastService)
app.use(ConfirmationService)

// Mount Application
app.mount('#app')
