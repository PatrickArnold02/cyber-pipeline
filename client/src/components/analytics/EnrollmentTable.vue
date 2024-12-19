<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useEnrollmentStore } from '@/stores/Enrollment';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import Panel from 'primevue/panel';
import ConfirmDialog from 'primevue/confirmdialog';
import { storeToRefs } from 'pinia'
import Select from 'primevue/select'
import { dt } from '@primevue/themes';

const enrollmentStore = useEnrollmentStore();

// Current year used to generate academic years
const currentYear = new Date().getFullYear()
const academicYears = ref([]) // Stores available academic years
const selectedYear = ref(null) // Stores the selected academic year


// The academic years to display in the select dropdown
//const academicYears = ref([
//    'NOT DEFINED', // This will not be used in prod, but is a placeholder to demonstrate the filter on the seed data with default values
//    `${currentYear - 1}-${currentYear}`,
//    `${currentYear}-${currentYear + 1}`, 
//    `${currentYear + 1}-${currentYear + 2}`, 
//    `${currentYear + 2}-${currentYear + 3}`
//])

// The current acacdemic year to filter by
const selectedAcademicYear = ref(`${currentYear}-${currentYear + 1}`)

const dataTableRef = ref(null)

// The courses filtered by academic year
const filteredCourses = computed(() => {
  if (!selectedAcademicYear.value) return getAllCourses.value;
  return getAllCourses.value.filter(course => course.academic_year === selectedAcademicYear.value);
});

const filters = ref({
    global: {
        value: null,
        matchMode: 'contains'
    }
});

// Exports the current data table to CSV
const exportCSV = () => {
    dataTableRef.value.exportCSV();
}

const { getAllCourses } = storeToRefs(enrollmentStore);

onMounted(() => {
    enrollmentStore.hydrate();

    // Extract unique academic years from the cohorts data
    academicYears.value = [
        ...new Set(
        cohortsStore.cohorts
            .filter((cohort) => cohort.academicYear) // Ensure valid years
            .map((cohort) => cohort.academicYear)
        ),
    ]
});

// Handle selection changes (optional)
const handleYearChange = (year) => {
  selectedYear.value = year
  console.log('Selected Year:', year)
}

</script>

<template>
    <ConfirmDialog></ConfirmDialog>

    <Panel header="Current Student Enrollment">
        <DataTable
            ref="dataTableRef"
            :value="filteredCourses"
            stripedRows
            tableStyle="min-width: 50rem"
            v-model:filters="filters"
            filterDisplay="row"
        >
            <template #header>
                <Toolbar
                    class="mb-2"
                    style="border: none"
                >
                    <template #start>
                        <Button
                            label="Export"
                            icon="pi pi-upload"
                            severity="help"
                            @click="exportCSV($event)"
                        />
                    </template>
                    <template #end>
                        <div class="flex justify-content-end gap-4">
                            <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-search"/>
                            </InputIcon>
                            <InputText 
                                v-model="filters['global'].value"
                                placeholder="Keyword Search"
                            />
                            </IconField>

                            <IconField iconPosition="left">
                                <InputIcon>
                                    <i class="pi pi-calendar"/>
                                </InputIcon>
                                <Select
                                    v-model="selectedYear"
                                    :options="academicYears"
                                    placeholder="Academic Year"
                                    @change="handleYearChange"
                                />
                            </IconField>
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
                header="Course"
            />
            <Column 
                field="academic_year"
                sortable
                header="Academic Year"
            />
            <Column 
                field="numStudents"
                sortable
                header="Total Enrollment"
            />
            <Column
                field="numPassed"
                sortable
                header="Total Passed"
            />
            <Column
                field="numNotPassed"
                sortable
                header="Total Not Passed"
            />
            <Column
                field="numWithdrawn"
                sortable 
                header="Total Withdrawn"
            />
            <Column 
                field="numIncompleteOrInProgress"
                sortable 
                header="Total Incomplete/In Progress"
            />
        </DataTable>
    </Panel>



</template>

<style scoped>
/* Add your styles here */
</style>