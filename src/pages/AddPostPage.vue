<template>
  <q-page class="q-mt-xl">
    <BoardTitle title="게시글 등록" />
    <q-form
      @submit="addPost"
      class="q-gutter-y-md column flex-center items-stretch"
      style="width: 50%"
    >
      <q-input
        v-model="title"
        outlined
        label="게시글 제목을 입력해주세요."
        lazy-rules
        :rules="rules"
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
        :rules="rules"
      />
      <q-btn
        :loading="loading"
        type="submit"
        color="primary"
        text-color="white"
        size="xl"
      >
        <div>글쓰기</div>
      </q-btn>
    </q-form>
  </q-page>
</template>

<script setup>
import { useBoardStore } from "src/stores/board";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import BoardTitle from "components/BoardTitle.vue";
import {
  outlinedAddCircle,
  outlinedTitle,
} from "@quasar/extras/material-icons-outlined";

const boardStore = useBoardStore();
const router = useRouter();

const rules = [(val) => (val && val !== "") || "내용을 입력해주세요."];

const title = ref("");
const content = ref("");
const loading = computed(() => boardStore.loading);

function addPost() {
  console.log(title.value, content.value);
  boardStore.addPost(title.value, content.value);
  alert("등록되었습니다. 게시글 목록으로 이동합니다.");
  router.push("/board");
}
</script>

<style lang="scss" scoped>
.q-form {
  margin: 0 auto;
}
</style>
