<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showHeader = computed(() => !['CountBookAPI', 'GetAllBookAPI'].includes(route.name))

import BHeader from "./components/BHeader.vue"
// Week 2 JSON component (temporarily disabled for Week 3 Activity 1)
// import JSONLab from "./components/JSON.vue"
</script>

<template>
  <div class="main-container">
    <BHeader v-if="showHeader" />

    <main>
      <!-- <LibraryRegistrationForm /> -->
      <!-- <JSONLab /> -->
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
