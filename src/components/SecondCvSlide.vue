<template>
  <div class="q-mt-sm q-gutter-y-lg column flex-center">
    <div class="text-h5 text-primary text-weight-bold">
      받고 싶으신 질문이 있으시면 추가로 등록해주세요!
    </div>
    <div class="input-container row q-gutter-x-md no-wrap" style="width: 100%">
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
            input-style="width: 600px;"
            lazy-rules
            :rules="[(val) => val !== '' || '내용을 입력해주세요.']"
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
    </div>
    <div class="question-list column q-gutter-y-sm" style="width: 100%">
      <q-toolbar class="bg-primary text-white text-center">
        <q-toolbar-title>추가 질문 리스트</q-toolbar-title>
      </q-toolbar>
      <q-list bordered separator>
        <q-item class="row" v-for="(question, index) in questions" :key="index">
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
    </div>
    <div class="buttons">
      <q-page-sticky position="bottom-right" :offset="[150, 80]">
        <q-btn size="xs" fab color="primary" @click="startCv">
          모의면접 시작
        </q-btn>
      </q-page-sticky>
    </div>
  </div>
</template>

<script setup>
import { useCvStore } from "src/stores/cv";
import {
  outlinedEdit,
  outlinedInfo,
} from "@quasar/extras/material-icons-outlined";
import { ref } from "vue";
import { useQuasar, QSpinnerGrid } from "quasar";
import { useRouter } from "vue-router";

const store = useCvStore();
const $q = useQuasar();
const router = useRouter();

const newQuestion = ref("");
const questions = ref([]);

// 질문 추가 함수
function addQuestion() {
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
function startCv() {
  store.mergeAdditionalQuestions(questions.value);
  store.$reset();

  // 면접 시작 페이지로 라우팅
  $q.notify({
    spinner: QSpinnerGrid,
    message: "면접이 시작됩니다.",
    color: "primary",
    position: "center",
    timeout: 2000,
    closeBtn: true,
  });
  router.push("/");
}
</script>

<style lang="scss" scoped></style>
