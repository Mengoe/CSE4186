import { defineStore } from "pinia";
import { useMemberStore } from "./member";
import { getToken } from "src/utils/cookies";
import { api } from "boot/axios.js";
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

    async function generateQuestions(
      questionNum,
      cvId,
      job,
      additionalQuestions,
    ) {
      questions.value = [];
      audios.value = [];

      const questionCreateAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/question/create`;
      const accessToken = bearerToken(getToken());

      const cvObj = {
        questionNum,
        selfIntroductionId: cvId,
        dept: job,
        additionalQuestions,
      };

      console.log(cvObj);

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
          questions.value = json.body.questions.map((item) => {
            // 각 객체에서 key와 value를 추출
            const [key, turn] = Object.entries(item)[0];

            // key 문자열에서 text와 audio 부분 추출
            const textMatch = key.match(/text=(.*?),\s*audio=/);
            const audioMatch = key.match(/audio=(.*?)}/);

            // text와 audio 값 추출
            const text = textMatch ? textMatch[1] : "";
            const audio = audioMatch ? audioMatch[1] : "";

            // 새 객체 생성
            return { question: text, audio, turn };
          });

          console.log(questions.value);
        } else throw new Error("질문 생성 에러");
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    }

    async function fetchAllCv(page, size) {
      cvLists.value = [];
      const accessToken = bearerToken(getToken());

      pageLoading.value = true;
      try {
        const res = await api.get(
          `/selfIntroduction/list?page=${page}&size=${size}`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
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
        const accessToken = bearerToken(getToken());

        loading.value = true;
        api
          .post("/selfIntroduction/save", JSON.stringify(params), {
            headers: { Authorization: accessToken },
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

    function deleteCv(cvId) {
      const accessToken = bearerToken(getToken());

      api
        .delete(`/selfIntroduction/${cvId}`, {
          headers: {
            Authorization: accessToken,
          },
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
    };
  },
  {
    persist: true,
  },
);
