<template>
  <div class="webCamera">
    <video
      id="video"
      ref="video"
      @canplay="canplay"
      video="600px"
      width="400px"
    >
      Video stream not available.
    </video>
    <q-btn @click="convertRecordState" :label="buttonStateLabel"></q-btn>
    <q-btn
      :label="isRecording ? '녹화 종료' : '다운로드'"
      @click="downloadRecord"
      v-show="isStreaming"
    />
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

defineOptions({
  name: "InterviewPage",
});
const isStreaming = ref(false);
const isRecording = ref(false);
const isPaused = ref(false);

const video = ref(null);
let mediaStream;
const buttonStateLabel = computed(() => {
  return isRecording.value
    ? isPaused.value
      ? "continue"
      : "pause"
    : isPaused.value
      ? "finish"
      : "start";
});
let recorder = null;
let recorded = [];
async function getMedia() {
  const constraints = {
    audio: {
      echoCancellation: { exact: true },
    },
    video: {
      width: 1280,
      height: 720,
    },
  };
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.value.srcObject = mediaStream;
    video.value.play();
    recorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm",
    });
    recorder.ondataavailable = handleDataAvailable;
  } catch (e) {
    console.log("오디오/비디오 접근에 실패했습니다", e);
  }
}

const startRecord = () => {
  recorder.start();
  isRecording.value = true;
};
const pauseRecord = () => {
  recorder.pause();
  isPaused.value = true;
};
const resumeRecord = () => {
  recorder.resume();
  isPaused.value = false;
};
const stopRecord = () => {
  recorder.stop();
  isStreaming.value = false;
  isPaused.value = false;
  isRecording.value = false;
  mediaStream.getTracks().forEach(function (track) {
    track.stop();
  });
};

function convertRecordState() {
  if (!isRecording.value && !isPaused.value) {
    startRecord();
    isRecording.value = true;
  } else if (!isPaused.value) {
    pauseRecord();
    isPaused.value = true;
  } else if (isRecording.value) {
    resumeRecord();
    isPaused.value = false;
  }
}

function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recorded.push(event.data);
  }
}

const canplay = (event) => {
  if (!isStreaming.value) {
    isStreaming.value = true;
  }
};

function downloadRecord() {
  if (isRecording.value) {
    stopRecord();
    isPaused.value = true;
    isRecording.value = false;
  } else {
    const blob = new Blob(recorded, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "test.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

getMedia();
</script>
