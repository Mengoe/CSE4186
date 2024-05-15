<template>
  <div>
    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section>
          <div>면접 영상 저장 및 종료</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="title" type="text" label="제목" />
        </q-card-section>
        <q-card-section>
          <video ref="videoPreview" controls width="500px">
            <source :src="videoUrl" type="video/webm" />
            해당 브라우저가 video 태그를 지원하지 않습니다.
          </video>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="면접 영상 저장 및 종료"
            color="primary"
            v-close-popup
            @click="saveFinishInterview"
          />
          <q-btn
            flat
            label="면접 영상 저장하지 않고 종료"
            color="primary"
            v-close-popup
            @click="finishInterview"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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

async function streamToUint8Array(stream) {
  return await new Response(stream).arrayBuffer();
}

const finishInterview = () => {
  saveFinished.value = true;
};

const saveFinishInterview = () => {
  isSaved.value = true;
};

watch(saveFinished, () => {
  if (saveFinished.value) {
    if (videoUrl.value) URL.revokeObjectURL(videoUrl.value);
    router.push("/interview/finish");
  }
});
</script>
