<template>
  <q-page class="gradient-bg text-wsfont">
    <img
      src="../assets/main-logo.png"
      alt="메인 로고"
      style="
        height: auto;
        width: 60px;
        position: absolute;
        top: 20px;
        left: 20px;
      "
    />
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
            @click="bringNextQuestion"
          />
        </div>
      </div>
      <div class="row justify-start">
        <div class="col-7">
          <WebCamera ref="webcamera" class="webcamera q-ma-md q-pa-sm" />
        </div>
        <div v-show="isStarted" class="col-5">
          <!---
          <InterviewTimer
            @timerEnd="handleTimerEnd"
            ref="timer"
            class="text-pink-12 text-bold"
            style="font-size: 30px"
          />
          --->
          <CountDownTimer duration="120" />
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
import { computed, ref, watch } from "vue";
import CountDownTimer from "components/CountDownTimer.vue";

const cvStore = useCvStore();
const interviewStore = useInterviewStore();
const { questions } = storeToRefs(cvStore);
const { isStarted, isFinished, count } = storeToRefs(interviewStore);
const timer = ref(null);
const webcamera = ref(null);
const questionShow = ref(false);

const handleTimerEnd = () => {
  bringNextQuestion();
};

const bringNextQuestion = () => {
  if (count.value < questions.value.length - 1) {
    count.value++;
    timer.value.resetTimer();
  } else {
    webcamera.value.finishInterview();
  }
};

const question = computed(() => questions.value[count.value].question);
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
