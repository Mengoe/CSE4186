<template>
  <q-page class="container">
    <LoaderComponent v-if="pageLoading" :size="5" :fixed="true" />

    <div v-else class="q-pa-md">
      <q-card-section>
        <h2 class="text-h5 text-center text-weight-bold">지난 면접 기록</h2>
        <q-separator />

        <q-list separator>
          <q-item
            v-for="(interview, idx) in interviews"
            :key="interview.id"
            class="relative-position q-pa-md"
          >
            <q-dialog v-model="showVideos[idx]" backdrop-filter="blur(4px)">
              <VideoModal :link="getSrc(interview.link)" />
            </q-dialog>
            <q-icon
              :name="outlinedDelete"
              size="xs"
              color="red"
              class="cursor-pointer absolute-right"
              @click="deleteInterview(interview.id, interview.link)"
            />
            <q-item-section
              @click="showVideos[idx] = true"
              class="cursor-pointer"
              id="element"
            >
              <q-item-label class="text-weight-bold text-subtitle2">{{
                interview.title
              }}</q-item-label>
              <q-item-label caption>{{ interview.createdAt }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-separator />
      </q-card-section>
    </div>
    <div class="q-mt-md">
      <Pagination
        :pageCount="pageCount"
        v-model:currentPageNumber="currentPageNumber"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { api } from "boot/axios.js";
import { getToken } from "src/utils/cookies.js";
import { useBoardStore } from "src/stores/board";
import { useRouter } from "vue-router";
import { outlinedDelete } from "@quasar/extras/material-icons-outlined";

import LoaderComponent from "components/LoaderComponent.vue";
import Pagination from "components/PaginationComponent.vue";
import { deleteVideo } from "src/utils/aws.js";
import VideoModal from "components/VideoContent.vue";
const boardStore = useBoardStore();
const router = useRouter();

const pageLoading = computed(() => boardStore.loading);
const pageCount = computed(() => boardStore.pageCount);
const interviews = computed(() => boardStore.videos);
const showVideos = ref([]);

function deleteInterview(videoId, videoKey) {
  if (!confirm("삭제하시겠습니까?")) return;

  const accessToken = "Bearer " + getToken();

  api
    .delete(`/video/${videoId}`, {
      headers: {
        Authorization: accessToken,
      },
    })
    .then((res) => {
      deleteVideo(videoKey)
        .then((res) => {
          alert("삭제되었습니다.");
          router.go(0);
        })
        .catch((err) => {
          alert("삭제에 실패했습니다.");
          router.go(0);
        });
    })
    .catch((err) => {
      alert("삭제에 실패했습니다.");
      router.go(0);
    });
}

const currentPageNumber = ref(1);
const INTERVIEW_PER_PAGE = 8;

watch(currentPageNumber, fetchVideos);

function fetchVideos() {
  boardStore.fetchVideos(currentPageNumber.value, INTERVIEW_PER_PAGE);
  showVideos.value = new Array(interviews.value.length).fill(false);
}

function getSrc(src) {
  console.log(src);
  return "https://cse4186.s3.ap-northeast-2.amazonaws.com/" + src;
}

fetchVideos();
</script>
<style lang="scss" scoped>
.container {
  margin: 0 auto;
  width: 50%;
  height: 80%;
}

.q-item {
  &:has(#element:hover) {
    background-color: $grey-3;
  }
}

.q-icon {
  border-radius: 5px;
  &:hover {
    background-color: $red-2;
  }
}
</style>
