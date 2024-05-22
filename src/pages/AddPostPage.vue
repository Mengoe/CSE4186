<template>
  <q-page class="q-mt-xl">
    <BoardHeader title="게시글 등록" />
    <q-form
      @submit="addPost"
      class="q-gutter-y-md column flex-center items-stretch q-pa-sm"
      style="width: 50%"
    >
      <div class="title-input">
        <q-input
          v-model="title"
          outlined
          label="게시글 제목을 입력해주세요."
          lazy-rules
          :rules="rules"
        >
          <template v-slot:prepend>
            <q-icon :name="outlinedTitle"></q-icon>
          </template>
        </q-input>
      </div>
      <div class="content-input">
        <q-editor
          v-model="content"
          outlined
          type="textarea"
          placeholder="내용을 입력해주세요."
          input-style="min-height:400px; max-height:400px; resize : none;"
          lazy-rules
          :rules="rules"
        />
      </div>
      <div class="upload-button row justify-end">
        <div
          v-if="isSelectedVideo"
          class="text-weight-bold row q-gutter-x-xs flex-center"
        >
          <div class="text-weight-bold">{{ videoTitle }}</div>
          <div class="cursor-pointer">
            <q-icon
              color="negative"
              @click="isSelectedVideo = false"
              :name="outlinedCancel"
            ></q-icon>
          </div>
        </div>
        <div v-else>
          <q-btn
            color="primary"
            text-color="white"
            @click="fetchVideos"
            :loading="videoFetchLoading"
          >
            면접 업로드
          </q-btn>
        </div>
        <q-dialog v-model="showVideoListModal" backdrop-filter="blur(4px);">
          <InterviewListModel
            v-model:showVideoListModal="showVideoListModal"
            @selected="(meta) => selectedVideo(meta)"
          />
        </q-dialog>
      </div>
      <div class="submit-button">
        <q-btn
          class="fit"
          :loading="loading"
          type="submit"
          color="primary"
          text-color="white"
          size="xl"
        >
          <div>글쓰기</div>
        </q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { useBoardStore } from "src/stores/board";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
  outlinedTitle,
  outlinedCancel,
} from "@quasar/extras/material-icons-outlined";
import BoardHeader from "src/components/BoardHeader.vue";
import InterviewListModel from "src/components/InterviewListModal.vue";

const boardStore = useBoardStore();
const router = useRouter();

const rules = [(val) => (val && val !== "") || "내용을 입력해주세요."];

const title = ref("");
const content = ref("");

const loading = computed(() => boardStore.loading);

const showVideoListModal = ref(false);
const videoFetchLoading = ref(false); // 비디오 조회 API호출 후 로딩
const isSelectedVideo = ref(false); // 사용자가 비디오를 선택했는지

const videoLink = ref(null); // 사용자가 선택한 비디오의 링크
const videoTitle = ref(null);
const videoId = ref(null);

function addPost() {
  console.log(title.value, content.value, videoId.value);
  boardStore.addPost(title.value, content.value, videoId.value);
  alert("등록되었습니다. 게시글 목록으로 이동합니다.");
  router.push("/board");
}

function fetchVideos() {
  videoFetchLoading.value = true;

  boardStore
    .fetchVideos()
    .then((res) => {
      console.log(res);
      videoFetchLoading.value = false;
      showVideoListModal.value = true;
    })
    .catch((err) => {
      videoFetchLoading.value = false;
      console.log(err);
    });
}

function selectedVideo(meta) {
  isSelectedVideo.value = true;

  videoLink.value =
    "https://cse4186.s3.ap-northeast-2.amazonaws.com/" + meta.link;
  videoTitle.value = meta.title;
  videoId.value = meta.id;

  console.log(videoId.value);
  console.log(videoTitle.value);
  console.log(videoLink.value);
}
</script>

<style lang="scss" scoped>
.q-form {
  margin: 0 auto;
}
</style>
