<template>
  <div class="board-footer row justify-between q-mt-md">
    <div class="column">
      <div class="search-form row q-gutter-x-sm">
        <select style="width: 150px; cursor: pointer" v-model="searchBy">
          <option v-for="(opt, idx) in options" :key="idx">{{ opt }}</option>
        </select>
        <q-btn
          outline
          class="my-btn"
          color="white"
          text-color="dark"
          @click="searchRequest"
        >
          검색
        </q-btn>
      </div>
      <div>
        <input style="width: 150px" v-model="searchText" />
      </div>
    </div>
    <div class="post-button">
      <q-btn size="md" color="primary" text-color="white" to="/board/post">
        글쓰기
      </q-btn>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const options = ["제목", "작성자"];

const searchBy = ref("제목");
const searchText = ref("");

function searchRequest() {
  if (searchText.value === "") return;
  console.log("came search?");
  router.push({
    path: "board",
    query: {
      q: searchText.value,
      searchBy: searchBy.value === "제목" ? "title" : "username",
    },
  });
}
</script>

<style lang="scss" scoped>
.board-footer {
  width: 70%;
  margin: 0 auto;
}
</style>
