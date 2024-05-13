<template>
  <q-card class="comment-form">
    <q-card-section class="column">
      <div class="row">
        <q-img src="~assets/interview_icon.png" width="8%" height="8%" />
        <div class="text-h4 text-dark text-weight-bolder q-ml-sm">
          면접 리뷰
        </div>
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
          v-for="(score, idx) in props.verbal"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ verbalCriteria[idx] }}
          </div>
          <div class="star-content row">
            <q-rating
              :model-value="score"
              size="2.5em"
              color="yellow"
              icon="star_border"
              icon-selected="star"
              no-dimming
              readonly
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
          v-for="(score, idx) in props.nonverbal"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ nonVerbalCriteria[idx] }}
          </div>
          <div class="star-content row">
            <q-rating
              :model-value="score"
              size="2.5em"
              color="yellow"
              icon="star_border"
              icon-selected="star"
              no-dimming
              readonly
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
          v-model="rev"
          outlined
          type="textarea"
          input-style="resize : none;"
          readonly
        ></q-input>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref } from "vue";

const props = defineProps({
  verbal: Array,
  nonverbal: Array,
  reviewText: String,
});

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

const rev = ref(props.reviewText);
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
