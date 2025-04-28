<script setup>
import { ref } from 'vue'
import { useTokenStore } from '@/stores/Token'
import { useEmailsStore } from '@/stores/Emails'
import { IftaLabel } from 'primevue'


const tokenStore = useTokenStore()
const emailStore = useEmailsStore()
const showDialog = ref(false)  // Show/Hide dialog
const showEmailForm = ref(false) // Toggle between K-State login and email form
const email = ref('') // Store email input

// Function to reset the form
const resetForm = () => {
  showEmailForm.value = false
  email.value = ''
}

// Function to handle the email form submission
// Send email to backend to get magic link
const submitEmail = async () => {
  magicLink  = await tokenStore.requestMagicLink(email.value)
  try {
    await emailStore.sendEmail({
      to: email.value,
      subject: "Log-in To CyberPipeline",
      text: `Here is your link to login to CyberPipeline: ${magicLink}`,
      html: `<p>Here is your <strong>link</strong> to login to <em>CyberPipeline</em>: <a href="${magicLink}">${magicLink}</a></p>`,
    })
    message.value = 'Email sent successfully'
  } catch (error) {
    message.value = 'Failed to send email'
    console.error('Failed to send email', error)
  }
}
</script>

<template>
  <!-- Login Dialog -->
  <Dialog header="Select Login Method" :visible="showDialog" :modal="true" @hide="resetForm" :style="{width: '400px'}">
    
    <div v-if="!showEmailForm">
      <!-- Buttons for login methods -->
      <div class="flex justify-evenly">
        <Button label="Login with K-State" @click="tokenStore.getToken()"></Button>
        <Button label="Login with Email" @click="showEmailForm = true"></Button>
      </div>
    </div>
    
    <!-- Email form if the "Login with Email" button is clicked -->
    <div v-else>
      <form @submit.prevent="submitEmail">
        <IftaLabel class="mb-2">
            <InputText type="email" id="email" v-model="email" variant="filled" />
            <label for="email">Email</label>
        </IftaLabel>
        <div class="flex justify-between">
          <Button type="submit" label="Submit"></Button>
          <Button label="Cancel" @click="showEmailForm = false" />
        </div>
      </form>
    </div>
    
  </Dialog>
</template>