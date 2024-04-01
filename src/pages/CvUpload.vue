<template>
  <q-page class="row items-stretch justify-center">
    <div style="width: 100%" class="column items-center">
      <q-carousel
        v-model="store.slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        padding
        height="100%"
        style="width: 100%"
        class="text-dark shadow-1 rounded-borders"
      >
        <q-carousel-slide name="style" class="column no-wrap flex-center">
          <FirstCvSlide />
        </q-carousel-slide>
        <q-carousel-slide name="tv" class="column no-wrap flex-center">
          <SecondCvSlide />
        </q-carousel-slide>
      </q-carousel>
      <ProgressBar :progress="progress" />
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import FirstCvSlide from "components/FirstCvSlide.vue";
import SecondCvSlide from "components/SecondCvSlide.vue";
import ProgressBar from "components/ProgressBar.vue";
import { matArrowBack, matArrowForward } from "@quasar/extras/material-icons";
import { useCvStore } from "src/stores/cv";
import { onMounted } from "vue";
const store = useCvStore();

const progress = computed(() => store.progress);

onMounted(() => {
  store.$reset();
});
</script>

<style lang="scss" scoped>
.q-carousel__slide {
  justify-content: flex-start;
}
</style>
