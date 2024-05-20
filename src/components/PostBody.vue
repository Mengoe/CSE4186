<template>
  <div class="body relative-position">
    <div
      class="video-comp relative-position column"
      v-if="props.videoList && props.videoList.length !== 0"
    >
      <div id="video" class="q-mt-md row flex-center">
        <video
          :key="props.videoList[0].video.id"
          ref="video"
          controlslist="nondownload"
          oncontextmenu="return false;"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          controls
        >
          <source
            :src="getSrc(props.videoList[0].video.link)"
            type="video/webm"
          />
        </video>
      </div>
      <div>
        <q-btn
          outline
          @click="togglePlayPause"
          color="primary"
          class="absolute-bottom-right"
          >{{ playButtonText }}</q-btn
        >
      </div>
    </div>
    <div class="text-comp text-h5 text-dark q-mt-lg q-mt-md q-ml-lg">
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
import { ref, computed } from "vue";

const props = defineProps({
  content: String,
  postId: Number,
  videoList: Array,
});

const boardStore = useBoardStore();
const memberStore = useMemberStore();
const userId = memberStore.userId;

const isPlaying = ref(false);
const playButtonText = computed(() => (isPlaying.value ? "정지" : "재생"));
const video = ref(null);

function togglePlayPause() {
  if (video.value.paused) video.value.play();
  else video.value.pause();
}

function submitReport() {
  if (!confirm("신고하시겠습니까?")) return;

  boardStore.submitReport({
    reportType: "post",
    userId,
    targetId: props.postId,
  });
}

function getSrc(src) {
  console.log(src);
  return "https://cse4186.s3.ap-northeast-2.amazonaws.com/" + src;
}
</script>

<style lang="scss" scoped>
.note {
  font-size: 10px;
}

#video {
  filter: blur(5px);
}
</style>
