<template>
  <q-card
    class="column flex-center items-stretch no-wrap relative-position"
    style="width: 100%"
  >
    <q-video :src="props.link" :ratio="16 / 9" />
  </q-card>
</template>
<script setup>
const props = defineProps({
  link: String,
});
</script>

<style lang="scss" scoped>
.q-card {
  border-radius: 10px;
}
</style>
