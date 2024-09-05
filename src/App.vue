<template>
  <v-app>
    <v-main>
      <div v-if="isLoading" class="d-flex justify-center align-center h-100">
        <v-progress-circular color="primary" indeterminate :width="8" :size="80">
        </v-progress-circular>
      </div>
      <GrammarsTreeView v-else :rawData="rawData" />
    </v-main>
  </v-app>
</template>

<style>
:root {
  --gradient-primary: linear-gradient(115deg, #0B24FB 1.78%, rgba(11, 32, 251, 0) 88.36%), #1042B5;
}

.v-sheet {
  background: var(--gradient-primary) !important;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';

const isLoading = ref(true);
const rawData = ref(null);

/**
 * Fetches the data
 */
async function fetchData(url: string) {
  try {
    isLoading.value = true;
    const response = await fetch(url);
    const data = await response.json();
    rawData.value = data;
  } catch (e) {
    console.error('Something went wrong: ', e)
  } finally {
    isLoading.value = false;
  }
};

fetchData('/api')

</script>
