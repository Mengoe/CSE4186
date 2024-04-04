import { defineStore } from "pinia";

export const useCvStore = defineStore("cv", {
  state: () => ({
    questions: [],
  }),

  getters: {},

  actions: {
    mergeAdditionalQuestions(newQuestions) {
      this.questions = [...this.questions, ...newQuestions];
    },
  },
});
