<template>
  <div class="board-header row q-gutter-x-md no-wrap q-pl-xl">
    <div class="button-container q-gutter-x-sm col-10">
      <q-btn
        v-for="(btn, index) in jobGroups"
        :key="index"
        class="button text-weight-bold"
        :class="{ 'selected-button': index == selectedJob }"
        @click="selectJob(index)"
      >
        {{ btn.btx }}
      </q-btn>
    </div>
    <div class="col-2 q-pl-sm">
      <q-btn
        class="text-weight-bold"
        size="md"
        color="primary"
        text-color="white"
        to="/board/post"
      >
        글쓰기
      </q-btn>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const props = defineProps({
  title: String,
});

const jobGroups = [
  { btx: "모두", q: "" },
  { btx: "백엔드/서버개발", q: "BE" },
  { btx: "프론트엔드", q: "FE" },
  { btx: "앱개발", q: "AP" },
  { btx: "게임개발", q: "GM" },
  { btx: "데이터 사이언티스트", q: "DS" },
  { btx: "빅 데이터 개발", q: "BD" },
  { btx: "데브옵스 개발", q: "DV" },
  { btx: "임베디드 소프트웨어 개발", q: "EM" },
  { btx: "정보보안", q: "SE" },
  { btx: "인공지능 개발", q: "AI" },
  { btx: "기타", q: "ET" },
];

const router = useRouter();

const searchBy = ref("제목");
const searchText = ref("");

var initJob;
const selectedJob = ref(null);

// job 상태 유지
function getSelectedJob() {
  const tmpJob = localStorage.getItem("selectedJob");
  if (tmpJob) {
    initJob = tmpJob;
    console.log(initJob);
  }
}

getSelectedJob();

onMounted(() => (selectedJob.value = initJob));

function selectJob(index) {
  if (selectedJob.value == index) return;
  selectedJob.value = index;
  console.log(selectedJob.value);

  if (index !== 0) {
    router.push({
      path: "board",
      query: {
        q: jobGroups[index].q,
        searchBy: "field",
      },
    });
  } else router.push("/board");
}

function searchRequest(scope) {
  scope.set(); // save text

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
.board-header {
  margin: 0 auto;
  width: 80%;
}

.button-container {
  white-space: nowrap;
  overflow: auto;
}

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

.q-btn {
  border-radius: 7px;
}
</style>
