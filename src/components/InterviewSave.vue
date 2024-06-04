<template>
  <div>
    <q-dialog v-model="showDialog" persistent>
      <q-card class="text-wsfont">
        <q-card-section class="column">
          <div class="text-center text-subtitle1 text-bold">
            모의 면접이 종료되었습니다.
          </div>
          <q-btn
            color="primary"
            flat
            unelevated
            @click="download"
            icon-right="download"
            ><span
              class="text-primary text-center text-subtitle2"
              style="text-decoration: underline"
              >면접 영상 다운로드</span
            ></q-btn
          >
          <q-input v-model="title" type="text" label="제목" />
        </q-card-section>
        <q-card-section>
          <video ref="videoPreview" controls width="500px">
            <source :src="videoUrl" type="video/webm" />
            해당 브라우저가 video 태그를 지원하지 않습니다.
          </video>
          <q-checkbox
            v-model="saveBox"
            label="면접 영상 서버에 저장"
            color="primary"
            class="text-primary text-bold"
          />
        </q-card-section>
        <q-card-actions class="column">
          <q-btn
            flat
            label="종료하기"
            color="primary"
            v-close-popup
            @click="finishInterview"
            class="align-center"
            size="lg"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div v-if="isSaved">
      <q-spinner-hourglass color="primary" size="3rem" :thickness="5" />
      면접 영상 저장 중입니다...
    </div>
  </div>
</template>

<script setup>
import { useInterviewStore } from "stores/interview.js";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const interviewStore = useInterviewStore();
const { videoUrl, saveFinished, isSaved, isFinished, title } =
  storeToRefs(interviewStore);
const showDialog = ref(false);
const router = useRouter();
watch(isFinished, () => {
  if (isFinished.value) showDialog.value = true;
});
const saveBox = ref(false);

const download = () => {
  const a = document.createElement("a");
  a.href = videoUrl.value;
  a.download = title.value ? title.value : "video" + ".webm";
  a.click();
  a.remove();
};

async function streamToUint8Array(stream) {
  return await new Response(stream).arrayBuffer();
}

const finishInterview = () => {
  saveBox.value ? (isSaved.value = true) : (saveFinished.value = true);
};

watch(
  saveFinished,
  () => {
    if (saveFinished.value) {
      if (videoUrl.value) URL.revokeObjectURL(videoUrl.value);
      isSaved.value
        ? router.replace("/interview/list")
        : router.replace("/cv/list");
    }
  },
  { immediate: true },
);
</script>
