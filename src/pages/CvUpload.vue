<template>
  <q-page class="q-gutter-y-md column flex-center text-wsfont">
    <div class="cv-title text-h6 q-pt-xl text-blue">자기소개서 등록하기</div>
    <q-form
      @submit="onSubmit"
      class="q-gutter-y-md column flex-center items-stretch q-pb-xl"
      style="width: 50%"
    >
      <div class="shadow-11 q-pb-xl q-pl-xl q-pr-xl q-pt-md custom-paper">
        <q-input
          v-model="title"
          :filled="!titleCompleted"
          :input-class="{
            'text-weight-bold text-h6 text-center': titleCompleted,
          }"
          :label="titleCompleted ? '' : '이 자기소개서의 제목을 입력해주세요.'"
          lazy-rules
          :rules="cvRules"
          @blur="handleTitleBlur"
          @focus="handleTitleFocus"
          ref="titleInput"
        >
          <template v-slot:prepend v-if="!titleCompleted">
            <q-icon :name="outlinedTitle"></q-icon>
          </template>
        </q-input>
        <div
          v-for="(pair, index) in questionAnswerPairs"
          :key="index"
          :class="{
            'relative-position': true,
          }"
        >
          <q-icon
            :name="outlinedDelete"
            color="negative"
            size="sm"
            class="cursor-pointer no-wrap"
            style="position: absolute; left: -30px; top: 20px; z-index: 1"
            @click="removePair(index)"
          ></q-icon>
          <q-expansion-item
            default-opened
            dense
            dense-toggle
            expand-icon-toggle
            class="expansion-items"
          >
            <template v-slot:header>
              <div class="q-gutter-x-none no-wrap full-width row">
                <q-input
                  class="col-11"
                  v-model="pair.title"
                  :label="'문항' + (index + 1)"
                  :rules="cvRules"
                  input-class="text-weight-bold"
                />
              </div>
            </template>
            <span class="text-field">
              <q-input
                type="textarea"
                v-model="pair.content"
                placeholder="문항에 해당하는 내용을 입력해주세요."
                outlined
                counter
                :rules="cvRules"
              />
            </span>
            <q-option-group
              v-model="pair.type"
              :options="questionOptions"
              inline
              size="xs"
            />
          </q-expansion-item>
        </div>
        <div class="row justify-center q-pt-xl">
          <q-btn @click="addForm" icon="add" outline rounded color="primary"
            >항목 추가</q-btn
          >
        </div>
      </div>
      <q-btn
        v-if="!isDoneRegister"
        :loading="loading"
        type="submit"
        color="blue"
        label="등록"
        icon="chevron_right"
        outline
        rounded
        size="lg"
      />
      <q-btn v-else color="primary" text-color="white" to="/cv/list" size="lg">
        면접 보러가기
      </q-btn>
    </q-form>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import {
  outlinedTitle,
  outlinedDelete,
} from "@quasar/extras/material-icons-outlined";
import { useCvStore } from "src/stores/cv";
import { useMemberStore } from "src/stores/member";

const $q = useQuasar();
const cvStore = useCvStore();

const cvRules = [(val) => (val && val !== "") || "내용을 입력해주세요!"];

const title = ref("");
const questionAnswerPairs = ref([{ title: "", content: "", type: "기타" }]);

const loading = computed(() => cvStore.loading);
const isDoneRegister = ref(false); // 자기소개서 등록 완료 됐는지를 나타내는 flag

const questionOptions = [
  { label: "인성 항목", value: "인성 항목" },
  { label: "기술 항목", value: "기술 항목" },
  { label: "기타", value: "기타" },
];

function removePair(idx) {
  if (questionAnswerPairs.value.length <= 1) return;

  questionAnswerPairs.value = questionAnswerPairs.value.filter(
    (_, index) => index !== idx,
  );
}

const titleCompleted = ref(false);
const titleInput = ref(null);
const handleTitleBlur = (e) => {
  if (titleInput.value.validate()) titleCompleted.value = true;
};

const handleTitleFocus = (e) => {
  if (titleCompleted.value) titleCompleted.value = false;
};

function addForm() {
  if (questionAnswerPairs.value.length >= 10) {
    $q.notify({
      message: "최대 10개의 항목까지만 입력이 가능합니다.",
      color: "negative",
      position: "center",
      timeout: 300,
    });

    return;
  }

  questionAnswerPairs.value.push({ title: "", content: "", type: "기타" });
  console.log(questionAnswerPairs.value);
}

async function onSubmit() {
  try {
    await cvStore.addCv({
      title: title.value,
      userId: useMemberStore().userId,
      detailList: questionAnswerPairs.value,
    });
    isDoneRegister.value = true;
    $q.notify({
      message: "자기소개서 등록 성공!",
      color: "positive",
      position: "center",
      timeout: 300,
    });
  } catch (err) {
    console.log(err);
  }
}
</script>

<style lang="scss" scoped>
.pair-form {
  border-radius: 10px;
  padding: 10px;
}
</style>
