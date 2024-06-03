<template>
  <q-btn
    v-if="cvLoading"
    :loading="cvLoading"
    color="primary"
    class="fixed-center z-max"
    size="lg"
    style="width: 250px"
  >
    <template v-slot:loading>
      <q-spinner-gears class="on-left" />
      면접질문 생성중...
    </template>
  </q-btn>
  <q-card
    class="column flex-center items-stretch no-wrap text-wsfont shadow-11 relative-position"
    style="height: 100%; width: 100%"
  >
    <q-card-section class="text-black text-h6 text-center q-mt-sm">
      모의면접 추가 요구사항
    </q-card-section>
    <q-card-section>
      <q-icon name="check" color="primary" size="sm" class="q-ml-sm" left />
      <span class="text-primary" style="font-size: 15px"> 직무 </span>
      <div class="row justify-start">
        <q-select
          class="q-ml-xl q-mt-sm col-4"
          :options="jobGroups"
          v-model="selectedJob"
          val="value"
          outlined
        ></q-select>
      </div>
    </q-card-section>
    <q-separator inset />
    <q-card-section>
      <q-icon name="check" color="primary" size="sm" class="q-ml-sm" left />
      <span class="text-primary" style="font-size: 15px">
        AI가 생성할 질문 개수
      </span>
      <div class="row justify-start">
        <q-input
          v-model.number="questionCount"
          class="q-ml-xl q-mt-sm q-mb-none col-4"
          type="number"
          outlined
          label="5~20까지 입력"
          input-style="width: 200px"
          :rules="[(val) => 5 <= val && val <= 20]"
        />
      </div>
    </q-card-section>

    <q-separator inset />
    <q-card-section>
      <q-icon name="check" color="primary" size="sm" class="q-ml-sm" left />
      <span class="text-primary" style="font-size: 15px">
        모의 면접에서 추가로 받고 싶은 질문이 있다면?
      </span>
      <div class="text-subtitle text-primary q-ml-lg q-mt-sm">Q.</div>
      <div class="input-form row no-wrap column">
        <q-form
          @submit="addQuestion"
          class="row no-wrap q-gutter-x-sm justify-start"
        >
          <q-input
            v-model="newQuestion"
            label="질문을 입력해주세요"
            autofocus
            class="q-ml-xl col-8"
          >
          </q-input>
          <q-btn
            push
            no-wrap
            size="md"
            type="submit"
            rounded
            flat
            class="text-primary"
            icon="add"
          />
        </q-form>
      </div>
    </q-card-section>

    <q-scroll-area style="height: 50%">
      <q-card-section class="question-list q-ml-xl">
        <q-icon name="list" size="sm" class="q-ml-sm" left />
        <span>추가된 질문 목록</span>
        <q-list separator dense>
          <q-item
            class="row"
            v-for="(question, index) in questions"
            :key="index"
          >
            <q-item-section class="col-8"
              >{{ index + 1 }}.{{ " " + question }}</q-item-section
            >
            <q-btn
              color="negative"
              filled
              icon="remove"
              flat
              @click="removeQuestion(index)"
            />
          </q-item>
        </q-list>
      </q-card-section>
    </q-scroll-area>

    <div class="buttons absolute-bottom-right q-pa-sm">
      <q-btn
        size="sm"
        fab
        color="primary"
        label="AI에게 넘겨 면접 시작하기"
        outline
        @click="startCv"
        icon="double_arrow"
        :disable="blockSubmit"
      >
      </q-btn>
    </div>
  </q-card>
</template>

<script setup>
import { useCvStore } from "src/stores/cv";
import { computed, ref } from "vue";
import { useQuasar, QSpinnerGrid } from "quasar";
import { useRouter } from "vue-router";

import { useInterviewStore } from "stores/interview.js";

const props = defineProps({
  detailList: Array, // 예상 질문 생성 위한 자기소개서의 내용
  cvId: Number,
  cvTitle: String,
});

const emit = defineEmits(["blockClosing"]);

const cvStore = useCvStore();
const $q = useQuasar();
const router = useRouter();

const newQuestion = ref("");
const questions = ref([]);
const questionCount = ref(10);
const cvLoading = computed(() => cvStore.loading);
const interviewStore = useInterviewStore();

const jobGroups = [
  { label: "백엔드/서버개발", value: 0 },
  { label: "프론트엔드", value: 1 },
  { label: "앱개발", value: 2 },
  { label: "게임개발", value: 3 },
  { label: "데이터 사이언티스트", value: 4 },
  { label: "빅 데이터 개발", value: 5 },
  { label: "데브옵스 개발", value: 6 },
  { label: "임베디드 소프트웨어 개발", value: 7 },
  { label: "정보보안", value: 8 },
  { label: "인공지능 개발", value: 9 },
  { label: "기타", value: 10 },
];

const selectedJob = ref(jobGroups[0]);
const blockSubmit = ref(false);

// 질문 추가 함수. 최대 10개까지 등록 가능
function addQuestion() {
  if (newQuestion.value === "") return;

  if (questions.value.length >= 10) {
    $q.notify({
      color: "negative",
      position: "center",
      message: "추가 질문은 최대 10개 입니다!",
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
  if (questionCount.value < 1 || questionCount.value > 30) {
    $q.notify({
      message: "질문 개수에 올바른 값을 입력해주세요!",
      color: "negative",
      position: "center",
      timeout: 300,
    });

    return;
  }

  const deptNum = jobGroups.findIndex((job) => job === selectedJob.value);

  emit("blockClosing", true);
  blockSubmit.value = true;

  cvStore
    .generateQuestions(
      questionCount.value,
      props.cvId,
      selectedJob.value.value,
      questions.value,
    )
    .then(() => {
      $q.notify({
        spinner: QSpinnerGrid,
        message: "면접이 시작됩니다.",
        color: "primary",
        position: "center",
        timeout: 300,
        closeBtn: true,
      });
      let dept = selectedJob.value.value;
      let cvId = props.cvId;
      router.push({
        path: "/interview",
        state: { dataObj: { cvId: cvId, dept: dept } },
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

cvStore.initLoading();
emit("blockClosing", false);
</script>
<style lang="scss" scoped>
.q-btn {
  border-radius: 10px;
}
</style>
