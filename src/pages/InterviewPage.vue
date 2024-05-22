<template>
  <q-page>
    <div>
      <WebCamera ref="webcamera" class="webcam" />
      <div>
        <InterviewTimer @timerEnd="handleTimerEnd" ref="timer" />
        <div v-if="isStarted">
          {{ question }}
        </div>
        <q-btn
          color="primary"
          icon="navigate_next"
          label="다음 문제 넘기기"
          @click="bringNextQuestion"
        />
        <InterviewSave />
      </div>
    </div>
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

const cvStore = useCvStore();
const interviewStore = useInterviewStore();
const { questions } = storeToRefs(cvStore);
const { isStarted, isFinished, count } = storeToRefs(interviewStore);
const timer = ref(null);
const webcamera = ref(null);

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

<style scoped></style>
