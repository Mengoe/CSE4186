<template>
  <div class="q-mt-sm q-gutter-y-lg column flex-center" style="width: 80%">
    <div class="cv-title text-h5 text-blue-8 text-weight-bold">
      자기소개서를 입력해주세요!
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md" style="width: 60%">
      <div class="cv-input">
        <q-input
          v-model="store.content"
          outlined
          type="textarea"
          placeholder="내용을 입력해주세요."
          input-style="min-height:350px; max-height:350px"
          lazy-rules
          :rules="contentRules"
        />
      </div>
      <div
        class="number-title text-h5 text-weight-bold text-blue-8 q-mt-xl text-center"
      >
        몇 개의 예상 질문을 생성할까요?
      </div>
      <div class="q_number-input row justify-around no-wrap">
        <q-input
          v-model.number="store.questionCount"
          type="number"
          outlined
          clearable
          lazy-rules
          label="최대 30까지의 숫자를 입력해주세요."
          :rules="countRules"
          style="width: 60%; flex-shrink: 0"
        ></q-input>
        <div>
          <q-btn
            v-if="!isDoneGen"
            :loading="loading"
            class="q-ml-sm"
            label="예상 질문 생성!"
            type="submit"
            color="primary"
            size="lg"
            no-wrap
          >
            <template v-slot:loading>
              <q-spinner-grid class="on-left" />
              생성중 ..
            </template>
          </q-btn>
          <q-btn
            v-else
            class="q-ml-sm"
            label="다음 페이지"
            type="button"
            color="primary"
            size="lg"
            @click.prevent="toNextStep"
          >
          </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCvStore } from "src/stores/cv";
import { onMounted } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

const store = useCvStore();
const $q = useQuasar();

const contentRules = [(val) => (val && val !== "") || "내용을 입력해주세요!"];
const countRules = [
  (val) => val || "숫자를 입력해주세요!",
  (val) => val <= 30 || "30 이하의 값만 입력해주세요!",
];

const loading = ref(false);
const isDoneGen = ref(false);
const genAPI =
  "https://259da068-0fdc-4898-8a3d-28d48fa2de21.mock.pstmn.io/api/getQuestions";

// 다른 페이지 이동했다가 다시 들어올 시, 작성했던 내용 초기화

function onSubmit() {
  loading.value = true;

  try {
    axios
      .get(genAPI)
      .then((res) => {
        console.log(res);
        store.questions = res.data.questions;
        $q.notify({
          position: "center",
          icon: "done",
          color: "primary",
          message: `생성 완료! 다음 페이지로 이동해주세요.`,
          timeout: 800,
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
        isDoneGen.value = true;
      });
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

function toNextStep() {
  store.slide = "tv";
  store.progress = 1.0;
}
</script>

<style lang="scss" scoped></style>
