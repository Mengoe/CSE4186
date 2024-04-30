import { defineStore } from "pinia";
import { useMemberStore } from "./member";
import { Cookies } from "quasar";
import axios from "axios";
export const useCvStore = defineStore("cv", {
  state: () => ({
    questions: [],
    cvLists: [],
    loading: false,
  }),

  getters: {},

  actions: {
    mergeAdditionalQuestions(newQuestions) {
      this.questions = [...this.questions, ...newQuestions];
    },

    fetchAllCv() {
      const userId = useMemberStore().userId;
      const getCvListAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/selfIntroduction/List/${userId}`;

      console.log(userId);
      const accessToken = Cookies.get("access_token");

      this.loading = true;

      axios
        .get(getCvListAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          console.log("fetchAllCv Succeed");
          this.cvList = res;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    addCv(title, content) {
      return new Promise((resolve, reject) => {
        const addCvAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/selfIntroduction/Save`;
        const userId = useMemberStore().userId;

        const accessToken = Cookies.get("access_token");

        const cvObj = {
          title,
          userId,
          content,
        };

        console.log(cvObj);

        this.loading = true;

        axios
          .post(addCvAPI, JSON.stringify(cvObj), {
            headers: {
              "Content-Type": `application/json`,
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            console.log(res);
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject("자기소개서 등록에 실패했습니다.");
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
});
