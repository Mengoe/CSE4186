<template>
  <q-card class="comment-form">
    <!-- 별점 부분 -->
    <q-card-section horizontal class="flex-center">
      <q-card-section class="col-6 full-height">
        <div
          class="review-content column text-weight-regular text-body2"
          v-for="(score, idx) in verbalScores"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold text-wsfont">
            {{ verbalCriteria[idx] }}
          </div>
          <div class="star-content row q-mb-sm">
            <q-rating
              v-model="verbalScores[idx]"
              size="2.5em"
              color="primary"
              icon="star_border"
              icon-selected="star"
              no-dimming
            ></q-rating>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col-6 full-height">
        <div
          class="review-content column text-weight-regular text-body2"
          v-for="(score, idx) in nonVerbalScores"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ nonVerbalCriteria[idx] }}
          </div>
          <div class="star-content row q-mb-sm">
            <q-rating
              v-model="nonVerbalScores[idx]"
              size="2.5em"
              color="primary"
              icon="star_border"
              icon-selected="star"
              no-dimming
            ></q-rating>
          </div>
        </div>
      </q-card-section>
    </q-card-section>

    <q-separator />
    <!-- 코멘트 부분 -->
    <q-card-section>
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

    <div class="row">
      <q-btn class="q-ml-md" color="negative" size="md" v-close-popup
        >취소</q-btn
      >
      <q-btn
        class="submit-button q-mr-md"
        color="primary"
        size="md"
        @click="updateComment"
      >
        제출하기
      </q-btn>
    </div>
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
  height: 70%;
}

.submit-button {
  margin-left: auto;
}
</style>
