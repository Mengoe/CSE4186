<template>
  <svg width="400px" height="400px">
    <text
      x="50%"
      y="50%"
      dominant-baseline="middle"
      text-anchor="middle"
      class="text-wsfont"
      fill="white"
      style="font-size: 20px"
    >
      {{ minutes }}:{{ seconds }}
    </text>
    <circle ref="path" class="path" cx="50%" cy="50%" r="35%"></circle>
  </svg>
  <span id="base-timer-label" class="base-timer__label"></span>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useInterviewStore } from "src/stores/interview";
import { ref, onMounted, watch } from "vue";
const TIME_LIMIT = 90;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

const path = ref(null);
const minutes = ref(null);
const seconds = ref(null);
let circum = 0;
let keyframes = null;
let options = {
  duration: TIME_LIMIT * 1000,
  easing: "linear",
  fill: "forwards",
};
let animation = null;

const interviewStore = useInterviewStore();
const { isStopped, isStarted, isFinished } = storeToRefs(interviewStore);

const emit = defineEmits(["endTimer"]);

function reset() {
  if (animation) animation.finish();
  animation = null;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = TIME_LIMIT;
  formatTime(TIME_LIMIT);
  path.value.style.strokeDashoffset = 0;
}

function start() {
  timerInterval = setInterval(() => {
    timeLeft--;
    formatTime(timeLeft);
    if (timeLeft === 0) {
      reset();
      emit("endTimer");
    }
  }, 1000);
  animation = path.value.animate(keyframes, options);
}

function stop() {
  if (animation) animation.pause();
  if (timerInterval) clearInterval(timerInterval);
}

function resume() {
  if (animation) animation.play();
  timerInterval = setInterval(() => {
    timeLeft--;
    formatTime(timeLeft);
    if (timeLeft === 0) {
      reset();
      emit("endTimer");
    }
  }, 1000);
}

function formatTime(time) {
  let sec = time % 60;
  seconds.value = sec < 10 ? "0" + sec : sec;
  let min = Math.floor(time / 60);
  minutes.value = "0" + min;
}

onMounted(() => {
  circum = path.value.r.baseVal.value * 2 * Math.PI;
  path.value.style.strokeDasharray = circum;
  path.value.style.strokeDashoffset = 0;
  keyframes = [{ strokeDashoffset: 0 }, { strokeDashoffset: circum }];
  formatTime(TIME_LIMIT);
});

watch(
  isStopped,
  () => {
    if (isStarted.value) {
      isStopped.value ? stop() : resume();
    }
  },
  { immediate: true },
);
watch(
  isFinished,
  () => {
    if (isFinished.value) reset();
  },
  { immediate: true },
);
defineExpose({ reset, start });
</script>

<style scoped>
.path {
  stroke-width: 10px;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  fill: none;
  stroke: #ff4162;
  stroke-dashoffset: 0;
}
</style>
