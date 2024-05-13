<template>
  <div class="title text-h4 text-center text-primary text-weight-bold">
    {{ props.title }}
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
});
</script>
