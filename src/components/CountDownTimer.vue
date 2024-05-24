<template>
  <div class="countdown" style="width: 300px; height: 300px">
    <div class="timer">
      <svg class="progress-ring" width="300" height="300">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="startColor" />
            <stop offset="100%" :stop-color="endColor" />
          </linearGradient>
        </defs>
        <circle
          :stroke="`url(#gradient)`"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          :r="radius"
          cx="150"
          cy="150"
          fill="transparent"
          :style="{ transition: `stroke-dashoffset ${duration}ms linear` }"
          stroke-width="20"
        />
      </svg>
      <div class="time" style="font-size: 20px">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";

export default {
  name: "CountdownTimer",
  props: {
    duration: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const elapsedTime = ref(0);

    const radius = 140;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = computed(() => {
      return circumference * (1 - elapsedTime.value / (props.duration * 1000));
    });

    const formattedTime = computed(() => {
      const remainingSeconds = Math.ceil(
        props.duration - elapsedTime.value / 1000,
      );
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    });

    const endColor = "#5a5aff"; // 퍼플
    const startColor = "#e91e63"; // 핑크

    const timer = setInterval(() => {
      elapsedTime.value += 100;
    }, 100);

    onMounted(() => {
      watch(elapsedTime, (newValue) => {
        if (newValue >= props.duration * 1000) {
          clearInterval(timer);
        }
      });
    });

    return {
      radius,
      circumference,
      dashOffset,
      formattedTime,
      startColor,
      endColor,
    };
  },
};
</script>

<style scoped>
.timer {
  position: relative;
  width: 300px;
  height: 300px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: #fff; /* 핑크 색상으로 설정 */
}
</style>
