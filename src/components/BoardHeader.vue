<template>
  <div class="board-header row q-gutter-x-md no-wrap">
    <div class="button-container q-gutter-x-sm col-10">
      <q-btn
        v-for="(btn, index) in jobGroups"
        :key="index"
        class="button text-weight-bold"
        :class="{ 'selected-button': index === selectedButton }"
        @click="selectJob(index)"
      >
        {{ btn }}
      </q-btn>
    </div>
    <div class="search-container col-2 row q-gutter-x-sm q-pl-sm">
      <div>
        <select
          class="search-form text-weight-bold"
          style=""
          v-model="searchBy"
        >
          <option v-for="(opt, idx) in options" :key="idx">{{ opt }}</option>
        </select>
      </div>
      <div class="cursor-pointer">
        <q-icon :name="outlinedSearch" color="dark" size="md"></q-icon>
        <q-popup-edit
          v-model="searchText"
          :offset="[10, 10]"
          v-slot="scope"
          color="dark"
        >
          <q-input
            v-model="scope.value"
            dense
            autofocus
            @keyup.enter.stop="scope.set"
            @keydown.enter.stop="searchRequest"
          >
            <template v-slot:after>
              <q-btn
                flat
                dense
                color="positive"
                icon="check_circle"
                @click="searchRequest"
              />
            </template>
          </q-input>
        </q-popup-edit>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { outlinedSearch } from "@quasar/extras/material-icons-outlined";
import { useRouter } from "vue-router";
const props = defineProps({
  title: String,
});

const jobGroups = [
  "모두",
  "백엔드/서버개발",
  "프론트엔드",
  "앱개발",
  "게임개발",
  "데이터 사이언티스트",
  "빅 데이터 개발",
  "데브옵스 개발",
  "임베디드 소프트웨어 개발",
  "정보보안",
  "인공지능 개발",
  "기타",
];

const router = useRouter();

const options = ["제목", "작성자"];
const searchBy = ref("제목");
const searchText = ref("");

const selectedButton = ref(0);

function selectJob(index) {
  selectedButton.value = index;
}

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
.board-header {
  margin: 0 auto;
  width: 80%;
}

.button-container {
  white-space: nowrap;
  overflow: auto;
}

// .button-container::-webkit-scrollbar {
//   display: none;
// }

.button {
  border-radius: 7px;
  border-style: solid; /* 테두리 스타일을 실선으로 설정 */
  border-width: 0.5px;
  border-color: $grey-2;
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
</style>
