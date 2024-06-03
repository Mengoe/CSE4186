<template>
  <q-card
    class="column flex-center items-stretch no-wrap relative-position"
    style="height: 100%; width: 100%"
  >
    <q-icon
      color="red"
      size="sm"
      class="cursor-pointer absolute-top-left z-max"
      :name="outlinedDelete"
      @click="deleteCv"
    />
    <q-scroll-area style="height: 100%">
      <div class="q-pb-xl q-pl-xl q-pr-xl q-mt-md custom-paper">
        <q-input
          :model-value="props.title"
          input-class="text-weight-bold text-h5 text-center"
          readonly
        />
        <div
          v-for="(pair, index) in props.detailList"
          :key="index"
          :class="{
            'relative-position': true,
          }"
        >
          <q-expansion-item
            default-opened
            dense
            dense-toggle
            expand-icon-toggle
            class="expansion-items"
          >
            <template v-slot:header>
              <div class="q-gutter-x-none no-wrap full-width row">
                <q-input
                  class="col-11"
                  :model-value="pair.title"
                  :label="'문항' + (index + 1)"
                  readonly
                  input-class="text-weight-bold"
                />
              </div>
            </template>
            <span class="text-field">
              <q-input
                type="textarea"
                :model-value="pair.content"
                outlined
                counter
                readonly
              />
            </span>
            <q-option-group
              :model-value="pair.type"
              :options="questionOptions"
              inline
              disable
              size="xs"
            />
          </q-expansion-item>
        </div>
      </div>
    </q-scroll-area>
  </q-card>
</template>

<script setup>
import { useCvStore } from "src/stores/cv";
import { outlinedDelete } from "@quasar/extras/material-icons-outlined";

const props = defineProps({
  title: String,
  detailList: Array, // 예상 질문 생성 위한 자기소개서의 내용
  cvId: Number,
});

const questionOptions = [
  { label: "인성 항목", value: "인성 항목" },
  { label: "기술 항목", value: "기술 항목" },
  { label: "기타", value: "기타" },
];

function deleteCv() {
  if (!confirm("삭제하시겠습니까?")) return;

  useCvStore().deleteCv(props.cvId);
}
</script>

<style lang="scss" scoped>
.pair-form {
  border-radius: 10px;
  padding: 10px;
}
</style>
