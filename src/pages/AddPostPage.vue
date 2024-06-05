<template>
  <q-page class="q-mt-xl">
    <div class="container q-mt-xl">
      <div class="row justify-end q-mb-md relative-position q-gutter-x-xs">
        <select v-model="selectedJob" class="absolute-left text-weight-bold">
          <option value="" v-if="selectedJob === ''">직무</option>
          <option v-for="job in jobFields" :key="job">{{ job.field }}</option>
        </select>
        <q-btn color="grey" size="md" to="/board">취소</q-btn>
        <q-btn
          color="primary"
          size="md"
          :disable="validateTitle || validateJob"
          @click="addPost"
          >작성</q-btn
        >
      </div>
      <q-separator />

      <div class="title-input">
        <q-input v-model="title" label="제목" lazy-rules :rules="rules" />
      </div>
      <div class="content-input">
        <q-editor
          v-model="content"
          outlined
          type="textarea"
          placeholder="내용을 입력해주세요."
          input-style=" resize : none;"
          min-height="50vh"
          max-height="50vh"
          lazy-rules
          :rules="rules"
          :definitions="{
            additionalToolbarOption,
          }"
          :toolbar="toolbars"
        />
        <q-dialog v-model="showVideoListModal" backdrop-filter="blur(4px);">
          <InterviewListModel
            v-model:showVideoListModal="showVideoListModal"
            @selected="(meta) => selectedVideo(meta)"
          />
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useBoardStore } from "src/stores/board";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { outlinedUploadFile } from "@quasar/extras/material-icons-outlined";

import InterviewListModel from "src/components/InterviewListModal.vue";

const boardStore = useBoardStore();
const router = useRouter();

const rules = [(val) => (val && val !== "") || "내용을 입력해주세요."];

const title = ref("");
const content = ref("");
const selectedJob = ref("");

const jobFields = computed(() => boardStore.jobFields);

const validateTitle = computed(() => {
  return title.value === "";
}); // for submit button disabled

const validateJob = computed(() => {
  return selectedJob.value === "";
});

const toolbars = computed(() => {
  return [
    ["left", "center", "right", "justify"],
    ["bold", "italic", "underline", "strike"],
    ["additionalToolbarOption"],
    ,
  ];
});

const additionalToolbarOption = computed(() => {
  return !isSelectedVideo.value
    ? {
        tip: "Upload my interview",
        icon: outlinedUploadFile,
        label: "면접 영상 업로드",
        handler: fetchVideos,
      }
    : {
        tip: "Cancel uploaded interview",
        icon: "cancel",
        color: "red",
        label: videoTitle.value,
        handler: () => {
          isSelectedVideo.value = false;
        },
      };
});

const showVideoListModal = ref(false);
const videoFetchLoading = ref(false); // 비디오 조회 API호출 후 로딩
const isSelectedVideo = ref(false); // 사용자가 비디오를 선택했는지

const videoLink = ref(null); // 사용자가 선택한 비디오의 링크
const videoTitle = ref(null);
const videoId = ref(null);

async function addPost() {
  const jobId =
    jobFields.value.findIndex((ele) => ele.field == selectedJob.value) + 1;

  console.log(jobId);
  if (jobId < 1) {
    console.log("job find error");
    return;
  }

  console.log(title.value, content.value, videoId.value);
  boardStore.addPost(title.value, content.value, videoId.value, jobId);
  alert("등록되었습니다. 게시글 목록으로 이동합니다.");
  await router.push("/board");
  router.go(0);
}

const INTERVIEW_PER_PAGE = 8;

function fetchVideos() {
  videoFetchLoading.value = true;
  boardStore
    .fetchVideos(1, INTERVIEW_PER_PAGE)
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

boardStore.fetchJobFields();
</script>

<style lang="scss" scoped>
.container {
  width: 50%;
  margin: 0 auto;
}

select {
  border-radius: 7px;
  border-style: solid; /* 테두리 스타일을 실선으로 설정 */
  border-width: 0.5px;
  border-color: $grey-5;
  transition: 0.4s;
  cursor: pointer;
  &:hover {
    background-color: $grey-3;
  }
}
</style>
