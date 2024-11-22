<script setup>
  import { defineProps } from 'vue';

  const emit = defineEmits(["closeModal"]);

  // Define the props for dialog visibility and header
  const props = defineProps({
    teacherDialog: Boolean,
    teacherDialogHeader: String,
    message: String,
    teacher: Object,
    errors: Object,
    statuses: Object,
  });

  const closeModal = () => {
      emit("closeModal");
  };
</script>

<template>
  <Dialog
    :visible="props.teacherDialog"
    :style="{ width: '850px' }"
    :header="props.teacherDialogHeader"
    :modal="true"
    class="p-fluid"
    :closeOnEscape="true"
    @update:visible="closeModal"
  >
    <Message
      v-if="message"
      severity="error"
      >{{ message }}
    </Message>
    <div
      class="flex flex-column align-items-center row-gap-5 w-full pt-3 mt-1"
      v-focustrap
      v-on:keyup.enter="save"
    >
    <TextField
        v-model="teacher.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
    />
    <TextField
        v-model="teacher.email"
        field="email"
        label="Email"
        icon="pi pi-envelope"
        :errors="errors"
      />
      <TextField
        v-model="teacher.eid"
        field="eid"
        label="eID"
        icon="pi pi-at"
        :errors="errors"
      />
      <TextField
        v-model="teacher.wid"
        field="wid"
        label="WID"
        icon="pi pi-key"
        :errors="errors"
      />
    </div>
    <div class="flex flex-row flex-wrap align-items-center row-gap-5 w-full">
      <div class="w-6 pr-1">
        <DropDownField
          v-model="teacher.status"
          field="status"
          label="Status"
          icon="pi pi-filter"
          :errors="errors"
          :values="statuses"
          valueLabel="label"
        />
      </div>
      <div class="w-6 pl-1">
        <DropDownField
          v-model="teacher.pd_status"
          field="pd_status"
          label="PD Status"
          icon="pi pi-briefcase"
          :errors="errors"
          :values="statuses"
          valueLabel="label"
        />
      </div>
      <div class="w-6 pr-1">
        <DropDownField
          v-model="teacher.cert_status"
          field="cert_status"
          label="Certificate Status"
          icon="pi pi-bookmark"
          :errors="errors"
          :values="statuses"
          valueLabel="label"
        />
      </div>
      <div class="w-6 pl-1">
        <DropDownField
          v-model="teacher.ms_status"
          field="ms_status"
          label="MS Status"
          icon="pi pi-star"
          :errors="errors"
          :values="statuses"
          valueLabel="label"
        />
      </div>
    </div>
    <TextField
      v-model="teacher.grade_level"
      field="grade_level"
      label="Grade Level"
      icon="pi pi-globe"
      :errors="errors"
    />
    <div class="w-full flex flex-column row-gap-5 -mt-3">
      <div class="w-full flex flex-row align-items-center">
        <label class="w-11 flex-grow-1 text-center">School Districts</label>
          <div class="pl-1">
            <Button
              icon="pi pi-plus"
              class="p-button-success"
              @click="teacher.districts.push({ id: '', notes: '', primary: false })"
            />
          </div>
      </div>
      
    </div>
  </Dialog>
</template>

<style scoped>
/* Scoped styles for EditTeacherDialog */
</style>
