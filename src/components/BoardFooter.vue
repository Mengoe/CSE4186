<template>
  <div class="board-footer flex justify-center q-pt-md q-pb-xl">
    <div class="search-container q-pl-sm">
      <q-form class="row q-gutter-x-sm" @submit="searchRequest">
        <div class="slt-box">
          <select
            class="search-form text-weight-bold"
            style=""
            v-model="searchBy"
          >
            <option v-for="(opt, idx) in options" :key="idx">{{ opt }}</option>
          </select>
        </div>
        <div>
          <input v-model="searchText" class="input-form" type="text" />
        </div>
        <div><q-btn color="primary" type="submit">검색</q-btn></div>
      </q-form>
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

.selected-button {
  border-style: solid; /* 테두리 스타일을 실선으로 설정 */
  border-width: 1px;
  background-color: $primary;
  color: white;
}

.slt {
  border-radius: 7px;
  border-style: solid; /* 테두리 스타일을 실선으로 설정 */
  border-width: 1px;
  border-color: $grey-5;
  transition: 0.4s;
  &:hover {
    background-color: $grey-3;
  }
}

.search-form {
  height: 35px;
  width: 70px;
  border-radius: 7px;
  border-style: solid; /* 테두리 스타일을 실선으로 설정 */
  border-width: 0.5px;
  border-color: $grey-5;
  transition: 0.4s;
  cursor: pointer;
  &:hover {
    background-color: $grey-3;
  }
}

.input-form {
  border-radius: 7px;
  border-style: solid; /* 테두리 스타일을 실선으로 설정 */
  border-width: 0.5px;
  border-color: $grey-5;
  transition: 0.4s;
  height: 35px;

  &:hover {
    background-color: $grey-3;
  }
}

.q-btn {
  border-radius: 7px;
}
</style>
