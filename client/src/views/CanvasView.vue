<template>
    <!-- Location for confirmation dialog to be inserted -->
    <ConfirmDialog></ConfirmDialog>
  
    <!-- Main datatable for items -->
    <Panel header="Manage Teachers">
      <DataTable
        ref="dt"
        :value="teachers"
        stripedRows
        sortField="name"
        :sortOrder="1"
        tableStyle="min-width: 50rem"
        v-model:filters="filters"
        filterDisplay="row"
        :globalFilterFields="['name', 'email', 'eid', 'wid', 'all_districts', 'grade_level']"
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50, 100]" :paginatorPosition="'top'"
      >
        <template #header>
          <Toolbar
            class="mb-2"
            style="border: none"
          >
            <template #end>
              <div class="flex justify-end">
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Keyword Search"
                  />
                </IconField>
              </div>
            </template>
          </Toolbar>
        </template>
        <template #empty>
          <div class="p-text-center">
            <p>No Teachers Found</p>
          </div>
        </template>
        <Column
          field="name"
          sortable
          header="Name"
        ></Column>
        <Column
          field="email"
          sortable
          header="Email"
        ></Column>
        <Column
          field="eid"
          sortable
          header="eID"
        ></Column>
        <Column
          field="wid"
          sortable
          header="WID"
        ></Column>
        <Column
          field="grade_level"
          header="Grade Level"
          sortable
        ></Column>
        <Column
          field="districts"
          header="Districts"
        >
          <template #body="slotProps">
            <Tag
              v-for="district in slotProps.data.districts"
              :key="district.id"
              :value="district.usdName"
              :severity="district.primary == true ? 'success' : 'secondary'"
              class="m-1"
            />
          </template>
        </Column>
        <Column
          field="cohorts"
          header="Cohorts"
        >
          <template #body="slotProps">
            <Tag
              v-for="cohort in slotProps.data.cohorts"
              :key="cohort.id"
              :value="cohort.name"
              class="m-1"
            />
          </template>
        </Column>
        <Column
          header="Actions"
          :exportable="false"
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <Button
              class="flex items-center gap-12 mb-12"
              label="View Courses"
              outlined
              @click="showCourseProgress(slotProps.data)"
              v-tooltip.bottom="'View Courses'"
            />
          </template>
        </Column>
      </DataTable>
    </Panel>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '../stores/Canvas.js';
import { useTeachersStore } from '../stores/Teachers.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import { FilterMatchMode } from '@primevue/core/api';
import ConfirmDialog from 'primevue/confirmdialog';
import { useCoursesStore } from '../stores/Courses.js';

const coursesStore = useCoursesStore();
const teachersStore = useTeachersStore();

const { courses } = storeToRefs(coursesStore);
const { teachers } = storeToRefs(teachersStore);
const searchQuery = ref('');

const canvasStore = useCanvasStore();

// State variables
const selectedTeacher = ref(null);
const filteredTeachers = ref([]);
const teacherEid = ref('');

const filters = ref({
  global: {
    value: '',
    matchMode: FilterMatchMode.CONTAINS
  },
  status: { value: null, matchMode: FilterMatchMode.IN },
  pd_status: { value: null, matchMode: FilterMatchMode.IN },
  cert_status: { value: null, matchMode: FilterMatchMode.IN },
  ms_status: { value: null, matchMode: FilterMatchMode.IN }
});

/**
 * Called when user selects View Courses on a teacher
 * Fetch the teacher's courses from the Canvas store.
 */
async function showCourseProgress(teacher) {
  teacherEid.value = teacher.eid;
  const teacher_courses = coursesStore.courses.filter(course => course.teachers.name === teacher.name);


  // ADD SOMETHING TO ITERATIVELY QUERY THE TEACHERS PROGRESS IN ALL COURSES IN TEACHER_COURSES 
  // NEXT, CONFIGURE DATATABLE TO DISPLAY THE TEACHERS COURSE LIST AND PROGRESS FOR RESPECTIVE COURSES 
  try {
    const response = await canvasStore.getCourseProgress(teacherEid);
    courses.value = response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}

</script>

<style scoped>
.p-layout {
  display: flex;
}

.p-sidebar {
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 200px;
  z-index: 1000;
  background-color: var(--surface-card);
  padding-right: 20px;
  padding-top: 20px;
}

.p-main-content {
  flex: 1;
  padding: 20px;
}

.mb-2 {
  margin-bottom: 20px;
}

.p-title {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.p-subtitle {
  font-size: 1.8em;
  margin-bottom: 10px;
}

.p-text-secondary {
  font-size: 1.2em;
  color: var(--text-secondary-color, #666);
}

.p-input {
  padding: 10px;
  font-size: 1em;
  margin-right: 10px;
}

.p-button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.p-button:hover {
  background-color: var(--primary-color-dark);
}
</style>
