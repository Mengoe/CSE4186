import { defineStore } from "pinia";
import { ref } from "vue";
export const useInterviewStore = defineStore("interview", () => {
  const videoUrl = ref(null);
  const isFinished = ref(false);
  const isStarted = ref(false);
  const isStopped = ref(false);
  const isSaved = ref(false);
  const saveFinished = ref(false);
  const title = ref("");

  function $reset() {
    videoUrl.value = null;
    isFinished.value = false;
    isStarted.value = false;
    isStopped.value = false;
    isSaved.value = false;
    saveFinished.value = false;
    title.value = "";
  }

  return {
    videoUrl,
    isFinished,
    isStarted,
    isStopped,
    isSaved,
    saveFinished,
    $reset,
    title,
  };
});
