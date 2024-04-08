<template>
  <div class="body text-h5 text-dark q-mt-lg q-ml-lg">
    {{ props.content }}
  </div>
</template>

<script setup>
const props = defineProps({
  content: String,
});
</script>
