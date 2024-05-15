<template>
  <q-card
    class="q-mt-sm column flex-center items-stretch no-wrap"
    style="height: 100%; width: 100%"
  >
    <q-card-section>
      <div class="text-primary text-h3 text-center">
        {{ props.title }}
      </div>
    </q-card-section>

    <q-separator inset />

    <q-scroll-area style="height: 80%">
      <q-card-section>
        <div
          class="text-center text-dark text-body1"
          style="white-space: pre-wrap"
          v-html="props.content"
        />
      </q-card-section>
    </q-scroll-area>
  </q-card>
</template>
<script setup>
const props = defineProps({
  title: String,
  content: String, // 예상 질문 생성 위한 자기소개서의 내용
});
</script>
