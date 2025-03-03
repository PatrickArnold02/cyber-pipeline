<script setup>
import { Dialog } from 'primevue';
import { ref } from "vue";

const visible = ref(true);
const draggable = false;
</script>

<template>
  <main>
    <Dialog :draggable="false" v-model:visible="visible" modal header="Log-in/Sign-up" :style="{ width: '25rem' }">
      <div class="flex items-center gap-4 mb-4">
          <Button label="Login As Admin"/>
      </div>
      <div class="flex items-center gap-4 mb-4">
          <Button label="Login As User"/>
      </div>
  </Dialog>
  </main>
</template>