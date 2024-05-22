<template>
  <div class="board-footer row justify-end">
    <q-btn size="md" color="primary" text-color="white" to="/board/post">
      글쓰기
    </q-btn>
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
