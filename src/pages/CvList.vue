<template>
  <q-page class="column items-center">
    <LoaderComponent v-if="pageLoading" :size="7" :fixed="true" />
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
              <CvDetails :content="cv.content" :title="cv.title" />
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
                <CvQuestion :content="cv.content" />
              </q-dialog>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useCvStore } from "src/stores/cv";
import axios from "axios";
import {
  outlinedFindInPage,
  outlinedFace,
} from "@quasar/extras/material-icons-outlined";

import LoaderComponent from "components/LoaderComponent.vue";
import CvQuestion from "components/CvQuestion.vue";
import CvDetails from "components/CvDetails.vue";

const cvStore = useCvStore();

//const cvLists = computed(() => cvStore.cvLists);
//const pageLoading = computed(() => cvStore.loading);
const cvLists = ref([]);
const pageLoading = ref(true);

const showDialog = ref(null); // 특정 자소서에 대해 예상 질문 생성 dialog 띄워줌
const showDetails = ref(null); // 특정 자소서 내용 dialog로 띄워줌

// get user's cv lists
onMounted(() => {
  /*
  cvStore.fetchAllCv();
  showDialog.value = new Array(cvLists.value.length).fill(false);
  showDetails.value = new Array(cvLists.value.length).fill(false);
  */

  const cvGetAPI =
    "https://259da068-0fdc-4898-8a3d-28d48fa2de21.mock.pstmn.io/cv"; // temporary url

  axios
    .get(cvGetAPI)
    .then((res) => {
      console.log(res.data.cv);
      cvLists.value = res.data.cv;
      showDialog.value = new Array(cvLists.value.length).fill(false);
      showDetails.value = new Array(cvLists.value.length).fill(false);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      pageLoading.value = false;
    });
});
</script>
<style lang="scss" scoped>
.q-item {
  transition: 0.4s;

  &:hover {
    background-color: $light-blue-1;
  }
}
</style>
