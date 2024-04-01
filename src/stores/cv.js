import { defineStore } from "pinia";

export const useCvStore = defineStore("cv", {
  state: () => ({
    content: "",
    questionCount: null,
    questions: [],
    firstSlideAcceptFlag: false, // 두 번째 슬라이드에서 제출 시, 이게 false면 제출 x
    // slide 이름을 store에서 관리하여서, next버튼 누르면 다음으로 이동!!
    slide: "style",
    progress: 0.5,
  }),

  getters: {},

  actions: {
    mergeAdditionalQuestions(newQuestions) {
      this.questions = [...this.questions, ...newQuestions];
    },
  },
});
