<template>
  <div class="pagination row flex-center q-mt-sm">
    <q-pagination
      v-model="currentPageNumber"
      :max="props.pageCount"
      :max-pages="5"
      :boundary-numbers="false"
      direction-links
      active-color="primary"
    >
    </q-pagination>
  </div>
</template>
<script setup>
const props = defineProps({
  pageCount: Number,
});

const currentPageNumber = defineModel("currentPageNumber"); // from BoardPage component
</script>
