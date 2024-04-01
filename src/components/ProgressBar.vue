<template>
  <q-linear-progress
    rounded
    size="20px"
    stripe
    :value="progress"
    color="warning"
    class="fixed-bottom"
    style="width: 80%; margin: 30px auto"
  />
</template>

<script setup>
const props = defineProps({
  progress: Number,
});
</script>
