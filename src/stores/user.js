import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    email: "testEmail@naver.com",
    passWord: "",
    nickName: "",
  }),

  getters: {},

  actions: {},
});
