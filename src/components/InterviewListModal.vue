<template>
  <q-card class="q-pa-md" style="height: 100%; width: 100%">
    <q-card-section>
      <h2 class="text-h5 text-center text-weight-bold">Interview List</h2>
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
            :name="outlinedUploadFile"
            size="sm"
            class="cursor-pointer absolute-right"
            style="top: 30%"
            @click="selectVideo(interview.link, interview.title, interview.id)"
          />
          <q-item-section
            class="cursor-pointer"
            id="element"
            @click="showVideos[idx] = true"
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

    <div class="q-mt-md">
      <Pagination
        :pageCount="pageCount"
        v-model:currentPageNumber="currentPageNumber"
      />
    </div>
  </q-card>
</template>

<script setup>
import { useBoardStore } from "src/stores/board";
import { computed, ref, watch } from "vue";
import { outlinedUploadFile } from "@quasar/extras/material-icons-outlined";

import VideoModal from "components/VideoContent.vue";
import Pagination from "components/PaginationComponent.vue";

const boardStore = useBoardStore();
const emit = defineEmits(["selected"]);
const showVideoListModal = defineModel("showVideoListModal");

const interviews = computed(() => boardStore.videos);
const showVideos = ref(new Array(interviews.value.length).fill(false));

const pageCount = computed(() => boardStore.pageCount);
const currentPageNumber = ref(1);
const INTERVIEW_PER_PAGE = 8;

watch(currentPageNumber, fetchVideos);

function fetchVideos() {
  boardStore.fetchVideos(currentPageNumber.value, INTERVIEW_PER_PAGE);
  showVideos.value = new Array(interviews.value.length).fill(false);
}

function selectVideo(link, title, id) {
  showVideoListModal.value = false;
  emit("selected", { link, title, id });
}

function getSrc(src) {
  console.log(src);
  return "https://cse4186.s3.ap-northeast-2.amazonaws.com/" + src;
}
</script>
<style lang="scss" scoped>
.q-item {
  &:has(#element:hover) {
    background-color: $grey-3;
  }
}

.q-icon {
  border-radius: 5px;
  &:hover {
    background-color: $grey-3;
  }
}
</style>
