<template>
  <q-card class="comment-form">
    <q-card-section class="column">
      <div class="row">
        <q-img src="~assets/interview_icon.png" width="8%" height="8%" />
        <div class="text-h4 text-dark text-weight-bolder q-ml-sm">
          면접 리뷰
        </div>
      </div>
      <div class="text-subtitle1 text-weight-medium">
        면접 어떠셨나요? 의견을 남겨주세요 🙂
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="row flex-center">
      <div class="col-3 text-subtitle1 text-dark text-weight-bold">
        면접 내용
      </div>
      <div class="q-pl-xl col-9 column q-gutter-y-lg">
        <div
          class="review-content column text-weight-regular text-body2"
          v-for="(criteira, idx) in verbalCriteria"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ criteira.name }} *
          </div>
          <div class="star-content row">
            <q-rating
              v-model="criteira.score"
              size="2.5em"
              color="yellow"
              icon="star_border"
              icon-selected="star"
            ></q-rating>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="row flex-center">
      <div class="col-3 text-subtitle1 text-dark text-weight-bold">
        비언어적 표현
      </div>
      <div class="q-pl-xl col-9 column q-gutter-y-lg">
        <div
          class="review-content column text-weight-regular text-body2"
          v-for="(criteira, idx) in nonVerbalCriteria"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ criteira.name }} *
          </div>
          <div class="star-content row">
            <q-rating
              v-model="criteira.score"
              size="2.5em"
              color="yellow"
              icon="star_border"
              icon-selected="star"
            ></q-rating>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="row flex-center">
      <div class="col-3 text-subtitle1 text-dark text-weight-bold">
        상세 의견
      </div>
      <div class="col-9 text-review q-gutter-y-sm">
        <q-input
          v-model="reviewText"
          outlined=""
          type="textarea"
          counter
          maxlength="300"
          input-style="resize : none;"
          placeholder="추가적으로 남기고 싶으신 말이 있으시면 입력해주세요."
        ></q-input>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="row">
      <q-btn color="negative" size="md" v-close-popup>취소</q-btn>
      <q-btn class="submit-button" color="primary" size="md" @click="addComment"
        >제출하기</q-btn
      >
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useBoardStore } from "src/stores/board";

// 추후 사용될 수도. 자연/인문계열에 따라서 평가 항목 다르게 할지?
const props = defineProps({
  isEngineering: Boolean,
});

const $q = useQuasar();
const boardStore = useBoardStore();

const reviewText = ref("");

function addComment() {
  console.log(verbalCriteria.value);
  console.log(nonVerbalCriteria.value);

  const verbalScores = verbalCriteria.value.map((element) => element.score);
  console.log(verbalScores);

  const nonVerbalScores = nonVerbalCriteria.value.map(
    (element) => element.score,
  );
  console.log(nonVerbalScores);

  const hasRemainingChecks =
    verbalScores.some((score) => score === 0) ||
    nonVerbalScores.some((score) => score === 0);

  if (hasRemainingChecks) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "모든 별점을 선택해주세요.",
      position: "center",
      timeout: 300,
    });

    return;
  }

  // api call
  boardStore.addComment(reviewText);
}

const verbalCriteria = ref([
  {
    name: "답변시간은 적절했나요?",
    score: 0,
  },
  {
    name: "표현은 명확했나요?",
    score: 0,
  },
]);

const nonVerbalCriteria = ref([
  {
    name: "자세는 어떤가요?",
    score: 0,
  },
  {
    name: "목소리 크기는 적절했나요?",
    score: 0,
  },
  {
    name: "말속도는 어떤가요?",
    score: 0,
  },
  {
    name: "태도는 어떤가요?",
    score: 0,
  },
]);
</script>
<style lang="scss" scoped>
.q-card {
  height: 100%;
  width: 80%;
}

.submit-button {
  margin-left: auto;
}
</style>
