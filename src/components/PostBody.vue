<template>
  <div class="body">
    <div class="video-comp q-mt-md">
      <q-video
        :ratio="16 / 9"
        src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
      />
    </div>
    <div class="text-comp text-h5 text-dark q-mt-lg q-ml-lg">
      {{ props.content }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: String,
});
</script>
