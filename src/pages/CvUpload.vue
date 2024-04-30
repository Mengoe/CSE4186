<template>
  <q-page class="q-gutter-y-lg column flex-center">
    <div class="cv-title text-h4 text-blue-8 text-weight-bold">
      자기소개서를 입력해주세요!
    </div>
    <q-form
      @submit="onSubmit"
      class="q-gutter-y-md column flex-center items-stretch"
      style="width: 50%"
    >
      <q-input
        v-model="title"
        outlined
        label="자기소개서의 제목을 입력해주세요."
        lazy-rules
        :rules="cvRules"
      >
        <template v-slot:prepend>
          <q-icon :name="outlinedTitle"></q-icon>
        </template>
      </q-input>
      <q-input
        v-model="content"
        outlined
        type="textarea"
        placeholder="내용을 입력해주세요."
        input-style="min-height:400px; max-height:400px"
        lazy-rules
        :rules="cvRules"
      />
      <q-btn
        v-if="!isDoneRegister"
        :loading="loading"
        type="submit"
        color="primary"
        text-color="white"
        size="xl"
      >
        <div>자기소개서 등록하기!</div>
        <q-icon :name="outlinedAddCircle" right></q-icon>
      </q-btn>
      <q-btn v-else color="primary" text-color="white" size="xl" to="/cvList">
        면접 보러가기
      </q-btn>
    </q-form>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import {
  outlinedAddCircle,
  outlinedTitle,
} from "@quasar/extras/material-icons-outlined";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCvStore } from "src/stores/cv";

const $q = useQuasar();
const cvStore = useCvStore();

const cvRules = [(val) => (val && val !== "") || "내용을 입력해주세요!"];
const title = ref("");
const content = ref("");

//const loading = computed(() => cvStore.loading); // 등록 대기 flag
const loading = ref(false);

const isDoneRegister = ref(false); // 자기소개서 등록 완료 됐는지를 나타내는 flag

const cvPostAPI =
  "https://259da068-0fdc-4898-8a3d-28d48fa2de21.mock.pstmn.io/post/cv";

function onSubmit() {
  /*
    try {
      await cvStore.addCv(title, content);
      isDoneRegister.value = true;
      $q.notify({
        message: "자기소개서 등록 성공!",
        color: $primary,
      });
    } catch (err) {
      console.log(err);
    }
  */

  // temp implementation. after fixing backend, this code will be replaced with above commented code
  try {
    let cvData = {};
    cvData.title = title.value;
    cvData.content = content.value;
    // 유저 id는 api 경로에 추가해서 보냄
    loading.value = true;

    axios
      .post(cvPostAPI, JSON.stringify(cvData), {
        headers: {
          "Content-Type": `application/json`,
        },
      })
      .then((response) => {
        console.log(response);
        // fail 처리 해야 됨
        if (response.data.message === "fail") {
        } else {
          // 성공
          $q.notify({
            position: "center",
            icon: "done",
            color: "primary",
            message: `${response.data.message}`,
            timeout: 800,
          });

          isDoneRegister.value = true;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped></style>
