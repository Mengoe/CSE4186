<template>
  <q-page class="column items-center">
    <LoaderComponent v-if="pageLoading" :size="5" :fixed="true" />
    <div
      v-else
      style="width: 50%; height: 80%"
      class="column q-gutter-y-xl q-mt-md"
    >
      <div class="text-h4 text-blue-8 text-weight-bold text-center">
        나의 자기소개서
      </div>
      <div class="shadow-14">
        <q-list separator>
          <q-item
            v-for="(cv, index) in cvLists"
            :key="index"
            class="fit"
            @click="showDetails[index] = true"
          >
            <q-dialog v-model="showDetails[index]" backdrop-filter="blur(4px);">
              <CvDetails
                :cvId="cv.id"
                :detailList="cv.detailList"
                :title="cv.title"
              />
            </q-dialog>

            <q-item-section avatar>
              <q-btn color="primary" @click="showDetails[index] = true" stack>
                <q-icon color="white" :name="outlinedFindInPage" />
              </q-btn>
            </q-item-section>

            <q-item-section class="text-subtitle1 text-weight-medium">
              {{ cv.title }}
            </q-item-section>

            <q-item-section side>
              <q-btn
                color="primary"
                size="md"
                push
                @click="showDialog[index] = true"
              >
                <q-icon left :name="outlinedFace"></q-icon>
                <div>모의 면접 보러가기</div>
              </q-btn>
              <q-dialog
                v-model="showDialog[index]"
                backdrop-filter="blur(4px);"
              >
                <CvQuestion
                  :cvId="cv.id"
                  :detailList="cv.detailList"
                  :cvTitle="cv.title"
                />
              </q-dialog>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="q-mt-md">
        <Pagination
          :pageCount="pageCount"
          v-model:currentPageNumber="currentPageNumber"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useCvStore } from "src/stores/cv";
import {
  outlinedFindInPage,
  outlinedFace,
} from "@quasar/extras/material-icons-outlined";

import LoaderComponent from "components/LoaderComponent.vue";
import CvQuestion from "components/CvQuestion.vue";
import CvDetails from "components/CvDetails.vue";
import Pagination from "components/PaginationComponent.vue";

const cvStore = useCvStore();

const cvLists = computed(() => cvStore.cvLists);
const pageLoading = computed(() => cvStore.pageLoading);
const pageCount = computed(() => cvStore.pageCount);

const showDialog = ref([]); // 특정 자소서에 대해 예상 질문 생성 dialog 띄워줌
const showDetails = ref([]); // 특정 자소서 내용 dialog로 띄워줌

const currentPageNumber = ref(1);
const CV_PER_PAGE = 8;

watch(currentPageNumber, fetchCvs);

// get user's cv lists
onMounted(() => {
  fetchCvs();
});

function fetchCvs() {
  cvStore.fetchAllCv(currentPageNumber.value, CV_PER_PAGE);
  showDialog.value = new Array(cvLists.value.length).fill(false);
  showDetails.value = new Array(cvLists.value.length).fill(false);
}
</script>
<style lang="scss" scoped>
.q-item {
  transition: 0.4s;

  &:hover {
    background-color: $light-blue-1;
  }
}
</style>
