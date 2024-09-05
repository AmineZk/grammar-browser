<template>
  <v-container>
    <v-card class="mx-auto w-75">
      <v-sheet class="pa-4 bg-primary">
        <v-text-field v-model="search" clear-icon="mdi-close-circle-outline" label="Search grammars"
          :clearable="!isLoading" dark>
          <template v-slot:append-inner>
            <v-progress-circular v-if="isLoading" color="dark-blue" indeterminate>
            </v-progress-circular>
          </template>
        </v-text-field>
      </v-sheet>
      <v-card-text style="max-height: 80vh;" class="overflow-auto">
        <div v-if="!Object.keys(filteredItems.result).length && debouncedSearch"
          class="text-h6 text-primary text-center">Your
          search - <strong>{{ debouncedSearch }}</strong> - did not match any grammar.</div>
        <v-treeview v-else-if="!isLoading" v-model:opened="open" :items="[filteredItems.result]" item-value="id"
          open-on-click>
          <template v-slot:append="{ item }">
            <span v-if="item.examples">Exmaples: {{ item.examples.join(', ') }}</span>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import _ from 'lodash';

import { transformToTree, filterByTitle } from '@/util/GrammarsTreeViewUtil';

const { rawData } = defineProps(['rawData']);

const open = ref([])
const search = ref('');
const isLoading = ref(false);
const debouncedSearch = ref('');
const caseSensitive = ref(false);
const items = ref(transformToTree(rawData));

const updateDebouncedSearch = _.debounce((newVal) => {
  debouncedSearch.value = newVal;
}, 400);

const filteredItems = computed(() => {
  return filterByTitle(items.value, debouncedSearch.value?.trim() ?? '');
});

watch(search, (newVal) => {
  updateDebouncedSearch(newVal);
  isLoading.value = true;
  if (!newVal) {
    open.value = [];
  }
});

watch(filteredItems, (newVal) => {
  open.value = newVal.expandedIds;
  isLoading.value = false
})

</script>