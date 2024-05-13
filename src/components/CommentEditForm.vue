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
          v-for="(score, idx) in verbalScores"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ verbalCriteria[idx] }} *
          </div>
          <div class="star-content row">
            <q-rating
              v-model="verbalScores[idx]"
              size="2.5em"
              color="yellow"
              icon="star_border"
              icon-selected="star"
              no-dimming
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
          v-for="(score, idx) in nonVerbalScores"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ nonVerbalCriteria[idx] }} *
          </div>
          <div class="star-content row">
            <q-rating
              v-model="nonVerbalScores[idx]"
              size="2.5em"
              color="yellow"
              icon="star_border"
              icon-selected="star"
              no-dimming
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
          @keyup.enter="updateComment"
        ></q-input>
      </div>
    </q-card-section>

    <q-separator inset />

    <q-card-section class="row">
      <q-btn color="negative" size="md" v-close-popup>취소</q-btn>
      <q-btn
        class="submit-button"
        color="primary"
        size="md"
        @click="updateComment"
      >
        제출하기
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useBoardStore } from "src/stores/board";

const $q = useQuasar();

const props = defineProps({
  verbal: Array,
  nonverbal: Array,
  review: String,
  postId: Number,
  commentId: Number,
});

const boardStore = useBoardStore();

const verbalScores = ref(props.verbal);
const nonVerbalScores = ref(props.nonverbal);
const reviewText = ref(props.review);

function updateComment() {
  const hasRemainingChecks =
    verbalScores.value.some((score) => score === 0) ||
    nonVerbalScores.value.some((score) => score === 0);

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

  const verbalData = [];
  verbalScores.value.forEach((score) => {
    verbalData.push(score);
  });

  const nonVerbalData = [];
  nonVerbalScores.value.forEach((score) => {
    nonVerbalData.push(score);
  });

  console.log(verbalData);
  console.log(nonVerbalData);

  const contentObj = {
    verbal: verbalData,
    review: reviewText.value,
    nonverbal: nonVerbalData,
  };

  // api call
  boardStore.updateComment(props.postId, props.commentId, contentObj);
}

const verbalCriteria = [
  "답변시간은 적절했나요?",
  "전공분야에 대한 이해가 충분한가요?",
  "표현하고자 하는 바를 간결하고 논리적으로 전달하나요?",
  "적절한 어휘력 및 용어를 사용하나요?",
  "질문에 대해 일관성 있게 답변하나요?",
];

const nonVerbalCriteria = [
  "자세는 어떤가요?",
  "목소리 크기는 적절했나요",
  "말속도는 어떤가요?",
  "태도는 어떤가요?",
];
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
