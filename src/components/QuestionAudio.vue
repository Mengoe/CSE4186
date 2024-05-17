<template>
  <div>
    <audio ref="audio"></audio>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCvStore } from "stores/cv.js";
import { useInterviewStore } from "stores/interview.js";
import { computed } from "vue";

const cvStore = useCvStore();
const interviewStore = useInterviewStore();
const { questions, count } = storeToRefs(cvStore);
const { isStarted } = storeToRefs(interviewStore);
const audioContext = new AudioContext();
const questionStreamDestination = audioContext.createMediaStreamDestination();

function base64ToUint8Array(base64) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

watch((count, isStarted), () => {
  if (isStarted.value) {
    // base64 형식의 오디오 데이터를 ArrayBuffer로 디코딩
    const audioData = base64ToArrayBuffer(questions.value[count.value]);
    audioContext.decodeAudioData(audioData).then((audioBuffer) => {
      const audioBufferSource = audioContext.createBufferSource();
      audioBufferSource.buffer = audioBuffer;
      audioBufferSource.connect(mediaStreamDestination);
      const questionAudioTrack = mediaStreamDestination.stream.getAudioTrack();
      audioBufferSource.start();
    });
  }
});
</script>
