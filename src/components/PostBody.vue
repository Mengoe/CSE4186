<template>
  <div class="body relative-position">
    <div class="video-comp q-mt-md">
      <q-video
        :ratio="16 / 9"
        src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"
      />
    </div>
    <div class="text-comp text-h5 text-dark q-mt-lg q-ml-lg">
      <div class="text-h5" v-html="props.content"></div>
      <div
        class="cursor-pointer note text-dark text-subtitle2 absolute-bottom-right"
        @click="submitReport"
      >
        {{ "신고하기" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBoardStore } from "src/stores/board";
import { useMemberStore } from "src/stores/member";
const props = defineProps({
  content: String,
  postId: Number,
});

const boardStore = useBoardStore();
const memberStore = useMemberStore();
const userId = memberStore.userId;

function submitReport() {
  if (!confirm("신고하시겠습니까?")) return;

  boardStore.submitReport({
    reportType: "post",
    userId,
    targetId: props.postId,
  });
}
</script>

<style lang="scss" scoped>
.note {
  font-size: 10px;
}
</style>
