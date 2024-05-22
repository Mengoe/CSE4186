<template>
  <q-card class="comment-form">
    <!-- 별점 부분 -->
    <q-card-section horizontal class="flex-center">
      <q-card-section class="col-6 full-height">
        <div
          class="review-content column text-weight-regular text-body2"
          v-for="(score, idx) in props.verbal"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold text-wsfont">
            {{ verbalCriteria[idx] }}
          </div>
          <div class="star-content row q-mb-sm">
            <q-rating
              :model-value="score"
              size="2.5em"
              color="primary"
              icon="star_border"
              icon-selected="star"
              no-dimming
              readonly
            ></q-rating>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="col-6 full-height">
        <div
          class="review-content column text-weight-regular text-body2"
          v-for="(score, idx) in props.nonverbal"
          :key="idx"
        >
          <div class="criteria-name text-weight-bold">
            {{ nonVerbalCriteria[idx] }}
          </div>
          <div class="star-content row q-mb-sm">
            <q-rating
              :model-value="score"
              size="2.5em"
              color="primary"
              icon="star_border"
              icon-selected="star"
              no-dimming
              readonly
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
  height: 70%;
}

.submit-button {
  margin-left: auto;
}
</style>
