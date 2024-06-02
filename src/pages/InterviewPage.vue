<template>
  <q-page class="gradient-bg text-wsfont">
    <a href="/">
      <img
        src="../assets/main-logo.png"
        alt="메인 로고"
        style="
          height: auto;
          width: 55px;
          position: absolute;
          top: 10px;
          left: 10px;
        "
      />
    </a>
    <div
      style="
        position: absolute;
        top: 70px;
        left: 60px;

        height: 90%;
      "
    >
      <q-checkbox
        v-model="questionShow"
        class="text-white text-weight-bold"
        :label="questionShow ? '' : '면접 질문 보이기'"
        color="primary"
      />
      <div
        class="text-white text-bold"
        style="font-size: 20px"
        v-if="isStarted"
      >
        <span v-if="questionShow"> "{{ question }}"</span>
        <div>
          <q-btn
            color="indigo-12"
            icon="navigate_next"
            rounded
            label="다음 문제로 넘기기"
            @click="bringQuestion"
            :disable="!isAnswer"
          >
            <q-tooltip anchor="top middle" v-if="!isAnswer">
              답변 시간에 다음 문제로 넘길 수 있습니다.
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <div
      style="
        position: absolute;
        top: 25%;
        left: 60px;
        flex-wrap: nowrap;
        width: 90%;
      "
      class="row"
    >
      <WebCamera
        ref="webcamera"
        class="webcamera q-ma-md q-pa-sm"
        @startTimer="handleStartTimer"
      />
      <span class="col-1"></span>
      <CountDownTimer ref="countdown" @endTimer="handleTimerEnd" />
    </div>
    <InterviewSave />
  </q-page>
</template>

<script setup>
import InterviewSave from "components/InterviewSave.vue";
import WebCamera from "components/WebCamera.vue";
import { useCvStore } from "stores/cv.js";
import { useInterviewStore } from "stores/interview.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import CountDownTimer from "components/CountDownTimer.vue";

const cvStore = useCvStore();
const interviewStore = useInterviewStore();
const { questions } = storeToRefs(cvStore);
const { count, turn, followUp, isStarted, isAnswer } =
  storeToRefs(interviewStore);
const timer = ref(null);
const countdown = ref(null);
const webcamera = ref(null);
const questionShow = ref(false);

const question = computed(() =>
  turn.value == 0
    ? questions.value.length > count.value
      ? questions.value[count.value].question
      : "면접이 종료되었습니다."
    : followUp.value,
);

const bringQuestion = () => {
  isAnswer.value = false;
  countdown.value.reset();
  handleTimerEnd();
};

const handleStartTimer = () => {
  countdown.value.start();
};

const handleTimerEnd = () => {
  isAnswer.value = false;
  turn.value < questions.value[count.value].turn - 1
    ? bringFollowUpQuestion()
    : bringNextQuestion();
};

const bringNextQuestion = () => {
  turn.value = 0;
  count.value++;
};

const bringFollowUpQuestion = () => {
  turn.value++;
};
</script>

<style scoped>
.webcamera {
  min-width: 400px;
  width: 40%;
}
.webcamera video {
  flex-shrink: 0;
}
.gradient-bg {
  background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);
}
</style>
