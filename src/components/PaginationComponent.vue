<template>
  <div class="pagination row flex-center q-mt-lg">
    <q-pagination
      v-model="currentPageNumber"
      :max="props.pageCount"
      :max-pages="5"
      :boundary-numbers="false"
      boundary-links
      outline
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
