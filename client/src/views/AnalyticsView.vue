<template>
    <div class="p-layout">
      <aside class="p-sidebar">
        <Menu :model="items" class="w-full md:w-60">
          <template #start>
              <span class="inline-flex items-center gap-1 px-2 py-2">
                <img
                  src="../assets/logo.png"
                  height="20px"
                  alt="CyberPipeline Logo"
                />
                  <span class="text-xl">Cyber <span class="text-primary">Pipeline</span></span>
              </span>
          </template>
          <template #submenulabel="{ item }">
              <span class="text-primary font-bold">{{ item.label }}</span>
          </template>
          <template #item="{ item, props }">
              <a class="flex items-center" v-bind="props.action">
                  <span :class="item.icon"></span> 
                  <span>{{ item.label }}</span>
                  <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                  <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
              </a>
          </template>
        </Menu>
      </aside>
      <main class="p-main-content">
        <header class="mb-2">
          <h1 class="p-title">Analytics</h1>
          <p class="p-text-secondary">Different tables that display the data used in the report to the state of Kansas</p>
        </header>
        <section v-if="activeTab === 'tab1'" class="p-section">
          <h2 class="p-subtitle">Enrollment</h2>
          <div class="table-container">
              <MainTable />
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useDistrictsStore } from '../stores/Districts.js'
  import { useCoursesStore } from '../stores/Courses.js'
  import { useCohortsStore } from '../stores/Cohorts.js'
  import MainTable from '@/components/analytics/EnrollmentTable.vue'
  import Menu from 'primevue/menu'
  import Badge from 'primevue/badge'

  const districtsStore = useDistrictsStore()
  const coursesStore = useCoursesStore()
  const cohortsStore = useCohortsStore()

  const items = ref([])
  
  // districtsStore.hydrate()
  // coursesStore.hydrate()
  // cohortsStore.hydrate()
  
  const { getAllDistrictsUsd } = storeToRefs(districtsStore)
 
  
  const activeTab = ref('tab1');
  
  function setActiveTab(tab) {
    activeTab.value = tab;
  }
  
  const districts = ref('');
  const svgUrl = ref('');
  
  const getDistrictList = async () => {
    districts.value = getAllDistrictsUsd.value
    svgUrl.value = 'https://k12map.cs.ksu.edu/Map?districts=' + districts.value
    console.log(svgUrl.value)
  }
  
  
  onMounted(() => {
    items.value = [
      {
        label: 'Enrollment',
        icon: 'pi pi-fw pi-user',
        command: () => setActiveTab('tab1')
      }
    ]

    watch(
      () => districtsStore.districts,
      (newDistricts) => {
        if(newDistricts.length > 0) {
          getDistrictList()
        }
      },
      { immediate: true }
    )
  })
  
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
  width: 250px;
  z-index: 1000;
  background-color: var(--surface-card);
  padding-right: 20px;
  padding-top: 20px;
}
  
  .p-main-content {
    flex: 1;
    padding: 20px;
  }
  
  .p-tabview-nav-container {
    list-style: none;
    padding: 0;
  }
  
  .p-tabview-nav-content {
    margin-bottom: 10px;
    cursor: pointer;
  }
  
  .p-tabview-nav-content a {
    color: var(--link-color);
    text-decoration: none;
  }
  
  .p-tabview-nav-content a:hover {
    text-decoration: underline;
  }
  
  .p-highlight {
    font-weight: bold;
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
  
  .p-text {
    font-size: 1.2em;
    line-height: 1.6;
  }
  
  .map-container{
    width: 700px;
    height: 400px;
    
  }
  
  .map-container iframe{
    width: 100%;
    height: 100%;
  }
  </style>
  