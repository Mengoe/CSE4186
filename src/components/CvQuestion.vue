<template>
  <LoaderComponent v-if="cvLoading" fixed :zIndex="999" :size="5" />
  <q-card
    class="column flex-center items-stretch no-wrap"
    style="height: 100%; width: 100%"
  >
    <q-card-section class="column flex-center q-gutter-y-md">
      <div class="text-primary text-h5 text-weight-bold">
        몇 개의 예상 질문을 생성할까요?
      </div>
      <q-input
        v-model.number="questionCount"
        type="number"
        outlined
        label="5부터 20사이의 숫자를 입력하세요."
        input-style="width: 200px"
        :rules="[
          (val) =>
            (1 <= val && val <= 20) || '5 ~ 20까지의 숫자만 입력 가능합니다.',
        ]"
      />
    </q-card-section>

    <q-separator inset />

    <q-card-section class="text-h5 text-primary text-center text-weight-bold">
      혹시 추가로 받고 싶으신<br />
      질문이 있으시면 등록해주세요!
    </q-card-section>

    <q-card-section class="input-container row q-gutter-x-md no-wrap">
      <div class="sub-title column">
        <div class="text-h6 text-primary">Question</div>
        <div class="text-subtitle2 text-primary">Question</div>
      </div>
      <div class="input-form row q-gutter-x-sm no-wrap">
        <q-form @submit="addQuestion" class="row no-wrap q-gutter-x-sm">
          <!-- to prevent default enter submit 엔터칠때 두번 제출되는 오류 해결해야됨 -->

          <q-input
            v-model="newQuestion"
            outlined
            label="질문을 입력해주세요"
            input-style="width: 200px;"
            autofocus
            lazy-rules
          >
            <template v-slot:prepend>
              <q-icon :name="outlinedEdit" />
            </template>
          </q-input>
          <q-btn
            push
            no-wrap
            color="primary"
            text-color="white"
            type="submit"
            size="md"
            style="height: 56px"
            >+ Add New</q-btn
          >
        </q-form>
      </div>
    </q-card-section>
    <q-scroll-area style="height: 50%">
      <q-card-section class="question-list column q-gutter-y-sm">
        <q-toolbar class="bg-primary text-white text-center">
          <q-toolbar-title>추가 질문 리스트</q-toolbar-title>
        </q-toolbar>
        <q-list bordered separator>
          <q-item
            class="row"
            v-for="(question, index) in questions"
            :key="index"
          >
            <q-item-section avatar>
              <q-icon color="primary" :name="outlinedInfo" />
            </q-item-section>
            <q-item-section class="text-weight-medium text-body1">{{
              question
            }}</q-item-section>
            <q-btn
              color="negative"
              text-color="white"
              filled
              @click="removeQuestion(index)"
            >
              Delete
            </q-btn>
          </q-item>
        </q-list>
      </q-card-section>
    </q-scroll-area>
    <div class="buttons">
      <q-page-sticky position="bottom-right" :offset="[150, 80]">
        <q-btn size="xl" fab color="primary" @click="startCv">
          모의면접 시작
        </q-btn>
      </q-page-sticky>
    </div>
  </q-card>
</template>

<script setup>
import { useCvStore } from "src/stores/cv";
import {
  outlinedEdit,
  outlinedInfo,
} from "@quasar/extras/material-icons-outlined";
import { computed, ref } from "vue";
import { useQuasar, QSpinnerGrid } from "quasar";
import { useRouter } from "vue-router";

import LoaderComponent from "./LoaderComponent.vue";

const props = defineProps({
  content: String, // 예상 질문 생성 위한 자기소개서의 내용
});

const cvStore = useCvStore();
const $q = useQuasar();
const router = useRouter();

const newQuestion = ref("");
const questions = ref([]);
const questionCount = ref(null); // 몇 개의 질문 생성하고자 하는지. 최대 30개
const cvLoading = computed(() => cvStore.loading);

// 질문 추가 함수. 최대 20개까지 등록 가능
function addQuestion() {
  if (newQuestion.value === "") return;

  if (questions.value.length > 20) {
    $q.notify({
      color: "negative",
      position: "center",
      message: "추가 질문은 최대 20개 입니다!",
      timeout: 300,
    });

    return;
  }

  questions.value.push(newQuestion.value);
  newQuestion.value = "";
}

// 질문 제거 함수
function removeQuestion(index) {
  questions.value.splice(index, 1);
}

// 면접 시작 함수
async function startCv() {
  if (questionCount.value < 1 || questionCount.value > 30) {
    $q.notify({
      message: "질문 개수에 올바른 값을 입력해주세요!",
      color: "negative",
      position: "center",
      timeout: 300,
    });

    return;
  }

  cvStore
    .generateQuestions(questionCount.value, props.content, questions.value) // number,
    .then(() => {
      $q.notify({
        spinner: QSpinnerGrid,
        message: "면접이 시작됩니다.",
        color: "primary",
        position: "center",
        timeout: 300,
        closeBtn: true,
      });

      router.push("/interview"); // 면접 보는 화면으로 넘어감.
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>
