import { defineStore } from "pinia";
import { getToken } from "src/utils/cookies";
import tokenApi from "src/utils/interceptor.js";
import { ref } from "vue";

export const useCvStore = defineStore(
  "cv",
  () => {
    const questions = ref([]);
    const audios = ref([]);
    const cvLists = ref([]);
    const loading = ref(false);
    const pageLoading = ref(false);
    const pageCount = ref(0);

    function bearerToken(token) {
      return "Bearer " + token;
    }

    function initLoading() {
      loading.value = false;
      pageLoading.value = false;
    }

    async function generateQuestions(
      questionNum,
      cvId,
      deptNum,
      additionalQuestions,
    ) {
      questions.value = [];
      audios.value = [];

      const questionCreateAPI = `https://jobjourney.shop/question/create`;
      const accessToken = bearerToken(getToken());

      const cvObj = {
        questionNum,
        selfIntroductionId: cvId,
        deptNum,
        additionalQuestions,
      };

      loading.value = true;
      try {
        const response = await fetch(questionCreateAPI, {
          method: "POST",
          headers: {
            "Content-Type": `application/json`,
            Authorization: accessToken,
          },
          body: JSON.stringify(cvObj),
        });

        console.log(response);
        const json = await response.json();
        console.log(json);

        if (json.result === "success") {
          const tmp = json.body.questions;
          for (let i = 0; i < tmp.length; i++) {
            questions.value[i] = {
              question: tmp[i][0]["Text"],
              audio: tmp[i][1]["Audio"],
              turn: tmp[i][2]["Turn"],
            };
          }

          console.log(questions.value);
        } else throw new Error("질문 생성 에러");
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    }

    */
    async function fetchAllCv(page, size) {
      cvLists.value = [];

      pageLoading.value = true;
      try {
        const res = await tokenApi.get(
          `/selfIntroduction/list?page=${page}&size=${size}`,
        );

        pageLoading.value = false;
        if (res.data.result === "success" && res.status === 200) {
          console.log(res);
          cvLists.value = res.data.body.list;
          pageCount.value = res.data.body.pageCount;
          console.log(pageCount.value);
        } else throw new Error("fetch Cv erorr");
      } catch (err) {
        pageLoading.value = false;
        console.log(err);
      }
    }

    function addCv(params) {
      return new Promise((resolve, reject) => {
        loading.value = true;
        tokenApi
          .post("/selfIntroduction/save", JSON.stringify(params))
          .then((res) => {
            console.log(res);
            resolve(true);
          })
          .catch((err) => {
            console.log(err);
            reject("자기소개서 등록에 실패했습니다.");
          })
          .finally(() => {
            loading.value = false;
          });
      });
    }

    function deleteCv(cvId) {
      tokenApi
        .delete(`/selfIntroduction/${cvId}`, {
          data: { id: cvId },
        })
        .then((res) => {
          console.log(res);
          alert("삭제되었습니다."); // reload page
          this.router.go(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return {
      questions,
      cvLists,
      loading,
      pageLoading,
      pageCount,
      generateQuestions,
      fetchAllCv,
      addCv,
      deleteCv,
      initLoading,
    };
  },
  {
    persist: { enabled: true, storage: localStorage },
  },
);
