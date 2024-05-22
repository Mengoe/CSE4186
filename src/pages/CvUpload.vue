<template>
  <q-page class="q-gutter-y-md column flex-center">
    <div class="cv-title text-h4 text-blue-8 text-weight-bold">
      자기소개서를 입력해주세요!
    </div>
    <q-form
      @submit="onSubmit"
      class="q-gutter-y-md column flex-center items-stretch"
      style="width: 50%"
    >
      <q-input
        v-model="title"
        filled
        label="자기소개서의 제목을 입력해주세요."
        lazy-rules
        :rules="cvRules"
      >
        <template v-slot:prepend>
          <q-icon :name="outlinedTitle"></q-icon>
        </template>
      </q-input>
      <div
        class="pair-form shadow-11 relative-position"
        v-for="(pair, index) in questionAnswerPairs"
        :key="index"
      >
        <q-icon
          :name="outlinedDelete"
          color="negative"
          size="sm"
          class="absolute-bottom-left cursor-pointer"
          style="z-index: 1"
          @click="removePair(index)"
        ></q-icon>
        <div class="question-pair row q-gutter-x-lg no-wrap">
          <q-input
            class="col-8"
            v-model="pair.title"
            label="자기소개서 항목을 입력해주세요."
            :rules="cvRules"
          />
          <q-select
            class="col-3"
            filled
            v-model="pair.type"
            :options="questionOptions"
            label="항목 종류"
            :rules="[(val) => !!val || '종류를 선택해주세요']"
          ></q-select>
        </div>
        <div class="text-field q-mt-md">
          <q-input
            type="textarea"
            v-model="pair.content"
            label="내용을 입력해주세요."
            outlined
            counter
            :rules="cvRules"
          />
        </div>
      </div>
      <div class="row justify-end">
        <q-btn color="primary" @click="addForm">항목 추가</q-btn>
      </div>
      <q-btn
        v-if="!isDoneRegister"
        :loading="loading"
        type="submit"
        color="primary"
        text-color="white"
        size="xl"
      >
        <div>자기소개서 등록하기</div>
      </q-btn>
      <q-btn v-else color="primary" text-color="white" size="xl" to="/cvList">
        면접 보러가기
      </q-btn>
    </q-form>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import {
  outlinedTitle,
  outlinedDelete,
} from "@quasar/extras/material-icons-outlined";
import { useCvStore } from "src/stores/cv";
import { useMemberStore } from "src/stores/member";

const $q = useQuasar();
const cvStore = useCvStore();

const cvRules = [(val) => (val && val !== "") || "내용을 입력해주세요!"];

const title = ref("");
const questionAnswerPairs = ref([{ title: "", content: "", type: "" }]);

const loading = computed(() => cvStore.loading);
const isDoneRegister = ref(false); // 자기소개서 등록 완료 됐는지를 나타내는 flag

const questionOptions = ["기술 항목", "인성 항목", "기타"];

function removePair(idx) {
  if (questionAnswerPairs.value.length <= 1) return;

  questionAnswerPairs.value = questionAnswerPairs.value.filter(
    (_, index) => index !== idx,
  );
}

function addForm() {
  if (questionAnswerPairs.value.length >= 10) {
    $q.notify({
      message: "최대 10개의 항목까지만 입력이 가능합니다.",
      color: "negative",
      position: "center",
      timeout: 300,
    });

    return;
  }

  questionAnswerPairs.value.push({ title: "", content: "", type: "" });
  console.log(questionAnswerPairs.value);
}

async function onSubmit() {
  try {
    await cvStore.addCv({
      title: title.value,
      userId: useMemberStore().userId,
      detailList: questionAnswerPairs.value,
    });
    isDoneRegister.value = true;
    $q.notify({
      message: "자기소개서 등록 성공!",
      color: "positive",
      position: "center",
      timeout: 300,
    });
  } catch (err) {
    console.log(err);
  }
}
</script>

<style lang="scss" scoped>
.pair-form {
  border-radius: 10px;
  padding: 10px;
}
</style>
