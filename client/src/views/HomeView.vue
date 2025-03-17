<template>
  <div class="p-layout">
    <aside class="p-sidebar">
      <Menu :model="items" class="w-full md:w-50">
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
        <h2>
          Learn and Teach Computer Science
        </h2>
      </header>
      <Divider />
      <Tabs value="0">
          <TabList>
              <Tab value="0">Header I</Tab>
              <Tab value="1">Header II</Tab>
              <Tab value="2">Header III</Tab>
          </TabList>
          <TabPanels>
              <TabPanel value="0">
                <p class="p-text">
                  The Cyber Pipeline program, a part of the larger K-State Computational Core program, 
                  has the goal of making quality computer science education available to all high school 
                  students at little or no cost to them. The Cyber Pipeline curriculum uses the basic Computational 
                  Core state-of-the-art curriculum with the latest technologies and educational practices. 
                  And best of all, the curriculum is completely free.
                </p>
                <p class="p-text">
                  However, the Cyber Pipeline program also provides innovative online instruction that includes 
                  video, text, and automatically graded hands-on exercises and projects. The curriculum is designed 
                  to use lectures and text from K-State faculty, as well as in-class activities and examples led by 
                  high school teachers.
                </p>
                <p class="p-text">
                  Since qualified computer science teachers are hard to find, the Cyber Pipeline program also provides 
                  a teacher training program. This includes a five- to six-week program where high school teachers go through 
                  the course material individually and have weekly interactive sessions where they can discuss the material, 
                  and share teaching strategies and more with K-State faculty and other teachers. There will also be a 
                  teacher's guide with additional instructional strategies and examples that teachers can use in the classroom.
                </p>  
              </TabPanel>
              <TabPanel value="1">
                  <p class="m-0">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                      ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                  </p>
              </TabPanel>
              <TabPanel value="2">
                  <p class="m-0">
                      ro tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                  </p>
              </TabPanel>
          </TabPanels>
      </Tabs>
      <div>
        
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Menu from 'primevue/menu';
import Badge from 'primevue/badge';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const items = ref([])

onMounted(() => {
  items.value = [
    {
      label: 'Curriculum',
      icon: 'pi pi-fw pi-book',
      command: () => alert('Curriculum page coming soon!')
    },
    {
      label: 'Teacher Support',
      icon: 'pi pi-fw pi-video',
      command:  () => alert('Curriculum page coming soon!')
    },
    {
      label: 'How To Join',
      icon: 'pi pi-fw pi-users',
      command:  () => alert('Curriculum page coming soon!')
    }
  ]
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
