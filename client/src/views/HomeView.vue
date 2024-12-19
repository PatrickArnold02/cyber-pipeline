<template>
  <div class="p-layout">
    <aside class="p-sidebar">
      <Menu :model="items" class="w-full md:w-50">
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
        <h1 id="top" class="p-title">Kansas State University: Cyber Pipeline Program</h1>
        <p class="p-text-secondary">Making quality computer science education available to all high school students at little or no cost.</p>
          <div v-if="svgUrl" class="map-container">
            <img id="svg-image" :src="svgUrl" alt="Failed font-semiboldto load map" />
            <div>
              <label class="label-text">Map of districts involved in the Cyber Pipeline Program</label>
            </div>
          <section id="curriculum" class="p-section">
            <h2 class="p-subtitle">Curriculum</h2>
            <p class="p-text">
              The Cyber Pipeline Curriculum contains several courses from K-State's Computational Core that have been aligned with AP curriculum standards. 
              These are the same courses we use in our Computer Science Certificate and Integrated Computer Science degree programs, 
              so students are getting the real college experience!
            </p>
          </section>
          <section id="online-instruction" class="p-section">
            <h2 class="p-subtitle">Online Instruction</h2>
            <p class="p-text">
              Innovative online instruction that includes video, text, and automatically graded hands-on exercises and projects. The curriculum is designed to use lectures and text from K-State faculty, as well as in-class activities and examples led by high school teachers.
            </p>
          </section>
          <section id="teacher-training" class="p-section">
            <h2 class="p-subtitle">Teacher Training</h2>
            <p class="p-text">
              The Cyber Pipeline program includes an engaging and robust professional development program designed to prepare a teacher with no background in computer science to teach the CC 110 and/or CC 210 courses in under a year. 
              The training is delivered asynchronously online, allowing you to fit it into your schedule. 
              Additionally, there is a synchronous (but also available as a recording) online seminar series held the first Friday of each month. 
              Finally, teachers engaging in the program have continuous access to mentoring by Computer Science and Pedagogy experts drawn from K-State faculty through instant messaging, email, and video collaboration.
            </p>
          </section> 
        </div>      
     </header>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useDistrictsStore } from '../stores/Districts.js'
import { storeToRefs } from 'pinia'
import Menu from 'primevue/menu';
import Badge from 'primevue/badge';

const items = ref([])

const districtsStore = useDistrictsStore()

const { getAllDistrictsUsd } = storeToRefs(districtsStore)

const districts = ref('');
const svgUrl = ref('');

const getDistrictList = async () => {
  districts.value = getAllDistrictsUsd.value
  svgUrl.value = 'https://k12map.cs.ksu.edu/Map?districts=' + districts.value
  console.log(svgUrl.value)
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  element.scrollIntoView({ behavior: 'smooth' })
}


onMounted(() => {
  items.value = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      command: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
      label: 'Curriculum',
      icon: 'pi pi-fw pi-book',
      command: () => scrollToSection('curriculum')
    },
    {
      label: 'Online Instruction',
      icon: 'pi pi-fw pi-video',
      command: () => scrollToSection('online-instruction')
    },
    {
      label: 'Teacher Training',
      icon: 'pi pi-fw pi-users',
      command: () => scrollToSection('teacher-training')
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

.p-map-and-text-container {
  display: flex;  
  flex-direction: column; /* Stacks map on top of text */
}

.p-map-container img{
  width: 100%;
  max-width: 1200px;
  height: auto;
}

.p-map-container,
.p-text-container {
  width: 50%; /* Full width when stacked */
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

.label-text{
  font-size: 0.8em;
  color: var(--text-secondary-color, #666);
}

.p-text {
  font-size: 1.2em;
  line-height: 1.6;
}
</style>
