import { defineStore } from "pinia";
import { useMemberStore } from "./member";
import { Cookies } from "quasar";
import { ref } from "vue";
import axios from "axios";

export const useCvStore = defineStore(
  "cv",
  () => {
    const questions = ref([]);
    const cvLists = ref([]);
    const loading = ref(false);
    const pageLoading = ref(false);

    async function generateQuestions(
      questionNum,
      content,
      additionalQuestions,
    ) {
      questions.value = [];

      const questionCreateAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/question/create`;
      const accessToken = Cookies.get("access_token");

      const cvObj = {
        questionNum,
        content,
        job: "sw개발", // tmp job scope
        additionalQuestions,
        additionalQuestionsSequence: additionalQuestions.map(
          (elem, index) => index, // tmp index
        ),
      };

      loading.value = true;

      try {
        const response = await fetch(questionCreateAPI, {
          method: "POST",
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(cvObj),
        });

        const json = await response.json();
        console.log(json);

        if (json.result === "success") {
          const questionPairs = JSON.parse(json.body);
          questions.value = questionPairs.map((obj) => obj.question);
          console.log(questions.value);
        } else throw new Error("질문 생성 에러");
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    }

    const fetchAllCv = async () => {
      cvLists.value = [];

      const userId = useMemberStore().userId;
      const getCvListAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/selfIntroduction/list/${userId}`;

      console.log(userId);
      const accessToken = Cookies.get("access_token");

      pageLoading.value = true;

      const res = await axios.get(getCvListAPI, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      pageLoading.value = false;
      console.log(res);

      if (res.data.result === "success") {
        if (res.status === 200) {
          cvLists.value = res.data.body;
        } else return Promise.reject("fetch fail");
      } else return Promise.reject("fetch fail");
    };

    function addCv(title, content) {
      console.log(title, content);

      return new Promise((resolve, reject) => {
        const userId = useMemberStore().userId;
        const addCvAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/selfIntroduction/save`;

        const accessToken = Cookies.get("access_token");

        const cvObj = {
          title,
          userId,
          content,
        };

        console.log(cvObj);

        loading.value = true;

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
            loading.value = false;
          });
      });
    }

    /* reset 필요하면 만들어야 됨. */
    return {
      questions,
      cvLists,
      loading,
      generateQuestions,
      fetchAllCv,
      addCv,
    };
  },
  {
    persist: true,
  },
);
