<template>
  <q-card
    class="q-mt-sm column flex-center items-stretch no-wrap relative-position"
    style="height: 100%; width: 100%"
  >
    <q-icon
      color="negative"
      size="sm"
      class="cursor-pointer absolute-top-right"
      :name="outlinedDelete"
      @click="deleteCv"
    />
    <q-card-section>
      <div class="text-dark text-h4 text-center text-weight-bolder">
        {{ props.title }}
      </div>
    </q-card-section>

    <q-separator inset />

    <q-scroll-area style="height: 80%">
      <q-card-section
        class="relative-position q-mt-sm"
        v-for="(detail, idx) in detailList"
        :key="idx"
      >
        <div class="text-subtitle2 text-primary absolute-top-left">
          {{ detail.type }}
        </div>
        <div class="text-weight-bold text-h6">
          {{ detail.title }}
        </div>
        <div
          class="text-start text-dark text-body1"
          style="white-space: pre-wrap"
          v-html="detail.content"
        ></div>
        <q-separator />
      </q-card-section>
    </q-scroll-area>
  </q-card>
</template>
<script setup>
import { outlinedDelete } from "@quasar/extras/material-icons-outlined";
import { useCvStore } from "src/stores/cv";
const props = defineProps({
  title: String,
  detailList: Array, // 예상 질문 생성 위한 자기소개서의 내용
  cvId: Number,
});

function deleteCv() {
  if (!confirm("삭제하시겠습니까?")) return;

  useCvStore().deleteCv(props.cvId);
}
</script>
