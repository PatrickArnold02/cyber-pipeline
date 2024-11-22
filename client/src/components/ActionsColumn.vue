//not working currently
<script setup>
  import Column from 'primevue/column';
</script>

<template>
  <Column
    header="Actions"
    :exportable="false"
    style="min-width: 8rem"
  >
    <template #body="slotProps">
      <Button
        icon="pi pi-pencil"
        outlined
        rounded
        class="mr-2"
        @click="console.log('edit')"
        v-tooltip.bottom="'Edit'"
      />
      <Button
        icon="pi pi-trash"
        outlined
        rounded
        class="mr-2"
        severity="danger"
        @click="console.log('delete')"
        v-tooltip.bottom="'Delete'"
      />
      <Button
        icon="pi pi-file"
        outlined
        rounded
        severity="info"
        @click="console.log('notes')"
        v-tooltip.bottom="'Notes'"
      />
    </template>
  </Column>
</template>
