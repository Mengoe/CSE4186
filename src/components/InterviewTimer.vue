<template>
  <div>{{ minutes }}:{{ seconds }}</div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useInterviewStore } from "stores/interview.js";
import { storeToRefs } from "pinia";

const interviewStore = useInterviewStore();
const emit = defineEmits(["timerEnd"]);
const { videoUrl, isFinished, isStarted, isStopped } =
  storeToRefs(interviewStore);
let timer = null;
const totalTime = ref(120);
function startTimer() {
  timer = setInterval(() => countdown(), 1000);
}
function stopTimer() {
  clearInterval(timer);
  timer = null;
}
function resetTimer() {
  clearInterval(timer);
  totalTime.value = 120;
  console.log("resetTimer");
  timer = setInterval(() => countdown(), 1000);
}
function padTime(time) {
  return (time < 10 ? "0" : "") + time;
}
function countdown() {
  if (totalTime.value >= 1) {
    totalTime.value--;
  } else {
    totalTime.value = 0;
    emit("timerEnd");
    resetTimer();
  }
}

const minutes = computed(() => {
  const minutes = Math.floor(totalTime.value / 60);
  return padTime(minutes);
});

const seconds = computed(() => {
  const seconds = totalTime.value % 60;
  return padTime(seconds);
});

watch(isStarted, () => {
  if (isStarted.value) startTimer();
});

watch(isStopped, () => {
  if (isStopped.value) stopTimer();
  if (!isStopped.value) startTimer();
});

watch(isFinished, () => {
  if (isFinished.value) {
    if (timer) stopTimer();
  }
});

defineExpose({
  resetTimer,
});
</script>
