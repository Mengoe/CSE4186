<template>
  <div class="body relative-position">
    <div
      class="video-comp relative-position column"
      v-if="post.videoList && post.videoList.length !== 0"
    >
      <div id="video" class="q-mt-lg row flex-center">
        <video
          :key="post.videoList[0].video.id"
          ref="video"
          controlslist="nondownload"
          oncontextmenu="return false;"
          @play="isPlaying = true"
          @pause="isPlaying = false"
          controls
        >
          <source
            :src="getSrc(post.videoList[0].video.link)"
            type="video/webm"
          />
        </video>
      </div>
      <div>
        <q-btn
          outline
          @click="togglePlayPause"
          color="primary"
          class="absolute-bottom-right hidden"
          >{{ playButtonText }}</q-btn
        >
      </div>
    </div>
    <div class="text-comp q-mt-lg q-mt-md q-ml-lg">
      <div class="text-body2 text-weight-regular" v-html="post.content"></div>
    </div>
    <div class="like q-ml-lg q-pt-lg q-pb-md relative-position overflow-hidden">
      <q-icon
        size="xs"
        :color="post.checkLikeOrDislike === 'like' ? 'red' : 'grey'"
        :name="iconName"
        class="cursor-pointer q-pa-xs"
        @click="reflectPrefence('like')"
      ></q-icon>
      <q-icon
        size="xs"
        color="dark"
        :name="outlinedEditNote"
        class="cursor-pointer q-pa-xs"
        @click="showCommentModal = true"
      ></q-icon>
      <q-dialog
        v-model="showCommentModal"
        backdrop-filter="blur(4px)"
        persistent
      >
        <CommentPostForm v-model:showCommentModal="showCommentModal" />
      </q-dialog>
      <span
        class="text-caption text-grey-8 q-pr-md text-weight-bold"
        style="float: right"
        >{{ "좋아요 " + like }} &bull;
        {{ "평가 " + post.comments.length }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { useBoardStore } from "src/stores/board";
import { ref, computed } from "vue";
import {
  outlinedEditNote,
  outlinedThumbUp,
} from "@quasar/extras/material-icons-outlined";
import CommentPostForm from "./CommentPostForm.vue";

const boardStore = useBoardStore();

const post = computed(() => boardStore.post);
const like = computed(() => boardStore.prefs.like);

const iconName = computed(() =>
  post.value.checkLikeOrDislike === "like" ? "favorite" : "favorite_border",
);
const showCommentModal = ref(false);

const isPlaying = ref(false);
const playButtonText = computed(() => (isPlaying.value ? "정지" : "재생"));
const video = ref(null);

function reflectPrefence(pref) {
  boardStore.reflectLikeOrDislike(post.value.id, pref);
}

function togglePlayPause() {
  if (video.value.paused) video.value.play();
  else video.value.pause();
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

.q-icon {
  border-radius: 15px;
  &:hover {
    background-color: $grey-4;
  }
}
</style>
