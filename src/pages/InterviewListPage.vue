<template>
  <q-page class="container">
    <LoaderComponent v-if="pageLoading" :size="5" :fixed="true" />
    <q-card v-else class="q-pa-md">
      <q-card-section>
        <h2 class="text-h6 text-center">Interview List</h2>
        <q-list bordered>
          <q-item
            v-for="interview in interviews"
            :key="interview.id"
            class="relative-position"
          >
            <q-icon
              name="cancel"
              color="negative"
              class="absolute-top-right cursor-pointer"
              @click="deleteInterview(interview.id, interview.link)"
            />
            <q-item-section>
              <q-btn color="tansparent" flat @click="onClick">
                {{ interview.title }}
              </q-btn>
              <q-item-label caption>{{ interview.createdAt }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
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
import LoaderComponent from "components/LoaderComponent.vue";
import Pagination from "components/PaginationComponent.vue";
import { deleteVideo } from "src/utils/aws.js";

const boardStore = useBoardStore();
const router = useRouter();

const pageLoading = computed(() => boardStore.loading);
const pageCount = computed(() => boardStore.pageCount);
const interviews = computed(() => boardStore.videos);

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
      deleteVideo(videoKey);
    })
    .then((res) => {
      router.go(0);
    })
    .catch((err) => {
      alert("삭제 중 문제가 발생했습니다.");
      router.go(0);
    });
}

const currentPageNumber = ref(1);
const INTERVIEW_PER_PAGE = 8;

watch(currentPageNumber, fetchVideos);

function fetchVideos() {
  boardStore.fetchVideos(currentPageNumber.value, INTERVIEW_PER_PAGE);
}

fetchVideos();
</script>
<style lang="scss" scoped>
.container {
  margin: 0 auto;
  width: 60%;
  height: 80%;
}
</style>
