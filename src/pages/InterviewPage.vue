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
      style="position: absolute; top: 100px; left: 60px"
      class="col justify-around flex-center"
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
          />
        </div>
      </div>
      <div class="row justify-start">
        <div class="col-7">
          <WebCamera ref="webcamera" class="webcamera q-ma-md q-pa-sm" />
        </div>
        <div v-show="isStarted" class="col-5">
          <InterviewTimer
            @timerEnd="handleTimerEnd"
            ref="timer"
            class="text-pink-12 text-bold"
            style="font-size: 30px"
          />

          <!---<CountDownTimer duration=120 />--->
        </div>
      </div>
    </div>
    <InterviewSave />
  </q-page>
</template>

<script setup>
import InterviewTimer from "components/InterviewTimer.vue";
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
const { count, turn, followUp, isStarted } = storeToRefs(interviewStore);
const timer = ref(null);
const webcamera = ref(null);
const questionShow = ref(false);

const question = computed(() =>
  turn.value == 0
    ? questions.value.length > count.value
      ? questions.value[count.value].question
      : "면접이 종료되었습니다."
    : followUp.value,
);

const handleTimerEnd = () => {
  bringQuestion();
};

const bringQuestion = () => {
  turn.value < questions.value[count.value].turn - 1
    ? bringFollowUpQuestion()
    : bringNextQuestion();
  timer.value.resetTimer();
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
