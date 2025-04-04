<script setup>
// Libraries
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'


// PrimeVue Components
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'
const confirm = useConfirm()
import { useToast } from 'primevue/usetoast'
const toast = useToast()
import { FilterMatchMode } from '@primevue/core/api'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Panel from 'primevue/panel'
import Popover from 'primevue/popover'
import Message from 'primevue/message'
import Dialog from 'primevue/dialog'
import Select from 'primevue/select'


// Non-PrimeVue components
import TextField from '@/components/forms/TextField.vue'
import DropDownField from '@/components/forms/DropDownField.vue'
import TextAreaField from '@/components/forms/TextAreaField.vue'

// Custom Components
// import AutocompleteMultiple from '../forms/AutocompleteMultiple.vue'

// Stores
import { useCoursesStore } from '@/stores/Courses'
const coursesStore = useCoursesStore()
import { useTeachersStore } from '@/stores/Teachers'
const teachersStore = useTeachersStore()

// Setup Stores
// coursesStore.hydrate()
const { courses } = storeToRefs(coursesStore)
// teachersStore.hydrate()
const { teachers } = storeToRefs(teachersStore)

// Variables
const courseDialog = ref(false) // controls opening the dialog
const courseDialogHeader = ref('') // controls header for dialog
const loading = ref(false) // controls loading message
const message = ref('') // error message on dialog form
const course = ref({}) // item to be edited
const errors = ref({}) // form errors
const dt = ref() // datatable reference
const notesDialog = ref(false) // controls notes dialog
const notes = ref('') // notes for selected item

const currentYear = new Date().getFullYear()
const academicYears = ref([
    'All',
    `${currentYear - 1}-${currentYear}`,
    `${currentYear}-${currentYear + 1}`, 
    `${currentYear + 1}-${currentYear + 2}`, 
    `${currentYear + 2}-${currentYear + 3}`
])
  

// Filters
const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS
  }
})

const selectedAcademicYear = ref(`All`)

const filteredCourses = computed(() => {
  if (!selectedAcademicYear.value || selectedAcademicYear.value === 'All') return courses.value
  return courses.value.filter(course => course.academic_year === selectedAcademicYear.value)
})

/**
 * Click handler to edit an item in the datatable
 *
 * @param {Course} aCourse item to edit
 */
const editCourse = (aCourse) => {
  course.value = { ...aCourse }
  courseDialogHeader.value = 'Edit Course'
  courseDialog.value = true
}

/**
 * Click handler for new button
 */
const newCourse = () => {
  course.value = {
    name: '',
    notes: '',
    teachers: [],
    academic_year: `${currentYear}-${currentYear + 1}`
  }
  courseDialogHeader.value = 'New Course'
  courseDialog.value = true
}

/**
 * Click handler to delete an item in the datatable
 *
 * @param {Course} aCourse item to delete
 */
const deleteCourse = (aCourse) => {
  confirm.require({
    message: 'Are you sure you want to delete ' + aCourse.name + '?',
    header: 'Danger Zone',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await coursesStore.delete(aCourse.id)
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Course Deleted!',
          life: 3000
        })
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.error,
          life: 3000
        })
      }
    },
    reject: () => {
      // do nothing
    }
  })
}

/**
 * Show notes handler
 *
 * @param {String} notes notes to display
 */
const toggleNotes = (aCourse, event) => {
  notes.value = aCourse.notes
  notesDialog.value.toggle(event)
}

/**
 * Save button handler in edit form dialog
 */
const save = async () => {
  loading.value = true
  errors.value = {}
  message.value = ''
  course.value.teachers = course.value.teachers.filter((item) => item.id)
  try {
    if (course.value.id) {
      await coursesStore.update(course.value)
    } else {
      await coursesStore.new(course.value)
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Course Updated!', life: 3000 })
    courseDialog.value = false
  } catch (error) {
    console.log(error)
    if (error.response.data.data) {
      errors.value = error.response.data.data
      message.value = 'The server rejected this submission. Please correct errors listed below'
    } else if (error.response.data.message) {
      message.value = error.response.data.message
    } else {
      message.value =
        'The server rejected this submission due to an SQL Error. Refresh and try again'
    }
  }
  loading.value = false
}

/**
 * Export datatable to CSV
 */
const exportCSV = () => {
  dt.value.exportCSV()
}

/**
 * Grade Statuses
 */
const statuses = [
  { label: 'Enrolled', id: 0, severity: 'primary', icon: 'pi pi-circle' },
  { label: 'Pass', id: 1, severity: 'success', icon: 'pi pi-check' },
  { label: 'Incomplete', id: 2, severity: 'warning', icon: 'pi pi-info' },
  { label: 'Fail', id: 3, severity: 'danger', icon: 'pi pi-times' },
  { label: 'Withdrawn', id: 4, severity: 'secondary', icon: 'pi pi-minus' }
]

/**
 * Custom export function to handle exporting datatable data
 * TODO update this to match your data structure
 *
 * @param {Course} row
 */
const exportFunction = (row) => {
  if (Array.isArray(row.data)) {
    var output = '"'
    for (const item of row.data) {
      output += item.name + ','
    }
    output += '"'
    console.log(output)
    return output
  } else {
    return row.data
  }
}
</script>

<template>
  <!-- Location for confirmation dialog to be inserted -->
  <ConfirmDialog></ConfirmDialog>

  <!-- Main datatable for items -->
  <Panel header="Manage Courses">
    <DataTable
      ref="dt"
      :value="filteredCourses"
      stripedRows
      sortField="usd"
      :sortOrder="1"
      tableStyle="min-width: 50rem"
      v-model:filters="filters"
      :globalFilterFields="['name']"
      :exportFunction="exportFunction"
      paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50, 100]" :paginatorPosition="'top'"
    >
      <template #header>
        <Toolbar
          class="mb-2"
          style="border: none"
        >
          <template #start>
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="newCourse"
            />
            <Button
              label="Export"
              icon="pi pi-upload"
              severity="help"
              @click="exportCSV($event)"
            />
          </template>
          <template #end>
            <div class="flex justify-end gap-12">
              <IconField iconPosition="left">
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Keyword Search"
                />
              </IconField>

              <div class="flex justify-content gap-2">
                <label for="yearSelect" class="year-label">Academic Year:</label>
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-calendar"/>
                  </InputIcon>
                  <Select
                    id="yearSelect"
                    v-model="selectedAcademicYear"
                    :options="academicYears"
                    placeholder="Academic Year"
                  />
                </IconField>
              </div>
              
            </div>
          </template>
        </Toolbar>
      </template>
      <template #empty>
        <div class="p-text-center">
          <p>No Courses Found</p>
        </div>
      </template>
      <Column
        field="name"
        sortable
        header="Name"
      ></Column>
      <Column 
        field="academic_year"
        sortable
        header="Academic Year"
      />
      <Column 
        field="course_id"
        sortable
        header="Course ID"
      />
      <!--
      <Column
        field="teachers"
        header="Teachers"
      >
        <template #body="slotProps">
          <Tag
            v-for="teacher in slotProps.data.teachers"
            :key="teacher.id"
            :value="teacher.name"
            severity="secondary"
            class="m-1"
          />
        </template>
      </Column>
      -->
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
            @click="editCourse(slotProps.data)"
            v-tooltip.bottom="'Edit'"
          />
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            class="mr-2"
            severity="danger"
            @click="deleteCourse(slotProps.data)"
            v-tooltip.bottom="'Delete'"
          />
          <Button
            v-if="slotProps.data.notes && slotProps.data.notes.length > 0"
            icon="pi pi-file"
            outlined
            rounded
            severity="info"
            @click="toggleNotes(slotProps.data, $event)"
            v-tooltip.bottom="'Notes'"
          />
        </template>
      </Column>
    </DataTable>
  </Panel>

  <!-- Notes dialog -->
  <Popover ref="notesDialog">
    <div class="flex flex-col gap-1 w-[25rem]">
      <div class="w-full">
        <span>Notes</span>
        <hr class="w-full" />
      </div>
      <span>{{ notes }}</span>
    </div>
</Popover>

  <!-- Edit item dialog -->
  <Dialog
    v-model:visible="courseDialog"
    :style="{ width: '850px' }"
    :header="courseDialogHeader"
    :modal="true"
    class="p-fluid"
    :closeOnEscape="true"
  >
    <Message
      v-if="message"
      severity="error"
      >{{ message }}</Message
    >
    <div
      class="flex flex-col items-center gap-y-8 w-full pt-6 mt-1"
      v-focustrap
      v-on:keyup.enter="save"
    >
      <TextField
        v-model="course.name"
        field="name"
        label="Name"
        icon="pi pi-user"
        :errors="errors"
      />
      <!--<AutocompleteMultiple
        v-model="course.teachers"
        field="teachers"
        label="Teachers"
        icon="pi pi-users"
        :errors="errors"
        :values="teachers"
        valueLabel="name"
      />-->
      <div class="w-full flex flex-col gap-y-8 -mt-6">
        <div class="w-full flex flex-row items-center">
          <label class="w-11/12 grow text-center">Teachers</label>
          <div class="pl-1">
            <Button
              icon="pi pi-plus"
              class="p-button-success"
              @click="course.teachers.push({ id: '', notes: '', status: 0 })"
            />
          </div>
        </div>
        <div
          class="w-full flex flex-row flex-wrap gap-y-8 items-center"
          v-for="(item, index) in course.teachers"
          :key="item.id"
        >
          <div class="w-4/12 pr-1">
            <DropDownField
              v-model="course.teachers[index].id"
              field="id"
              label="Teacher"
              icon="pi pi-user"
              :errors="errors"
              :values="teachers"
              valueLabel="name"
            />
          </div>
          <div class="w-3/12 px-1">
            <DropDownField
              v-model="course.teachers[index].status"
              field="status"
              label="Grade"
              icon="pi pi-circle"
              :errors="errors"
              :values="statuses"
              valueLabel="label"
            />
          </div>
          <div class="w-4/12 grow px-1">
            <TextField
              v-model="course.teachers[index].notes"
              field="notes"
              label="Notes"
              icon="pi pi-file"
              :errors="errors"
            />
          </div>
          <div class="pl-1">
            <Button
              icon="pi pi-trash"
              class="p-button-danger"
              @click="course.teachers.splice(index, 1)"
            />
          </div>
        </div>
      </div>
      <label class="w-11/12 grow text-center">Academic Year</label>
      <Select 
        v-model="course.academic_year"
        field="academic_year"
        label="Academic Year"
        icon="pi pi-calendar"
        :errors="errors"
        :options="academicYears"
        placeholder="Academic Year"
      />
      
      <label class="w-11/12 grow text-center">Canvas Course ID</label>
      <InputText 
        v-model="course.course_id"
        field="course_id"
        label="Course ID"
        icon="pi pi-id-card"
        :errors="errors"
        readonly
      />
      <TextAreaField
        v-model="course.notes"
        field="notes"
        label="Notes"
        icon="pi pi-file"
        :errors="errors"
      />
      
      <Button
        label="Save"
        icon="pi pi-check"
        @click="save"
        :loading="loading"
      />
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.p-datatable-header) {
  padding: 0px !important;
}

.year-label{
  font-size: 1.1rem;
  line-height: 2;
}
</style>
