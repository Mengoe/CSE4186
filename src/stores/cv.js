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

    const audio =
      "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QiEYlle5dFOrK5CHIPYhthciMZ0ChUyK//NExDkR8xa4AEBKuSQo4gUJMUJmUAARjpEmnQjXlb/////////mv19+K/+VWlj2dXNVJviGhnHXbOtzE1eOLoe8wolD2HEAGo68OhJaqKhgQg/BEQxQeJBWg/EIHg6U//NExEQR8yKoACgQvFQmEW0JBOOt///////////////K/DStQy//UNAszM0w1NKr/rWv8qzM9Cx0hyHzXkmtdeULCws1qSDU2AeD4kcwqSHIe0SasioDkZQMaBC/on8i//NExE8RCxaMADgQuWPxkanXLpjRRWtNHt0iuwQw9AxQpbZunX9Hp2//3//2//26eb1ZOmxkMtNOVtuxuvdc2bL8xnRwFV2NOKouI2azjhipaBgbIb34eXTBwfWX/D0C//NExF0R8uZAAVQQAS7LwNZwFBkl+zFsL1gKHA+K/8OkIIDY2PRp/+GrAt8DGAAwwbDhgv//NxyBwBicWWOMG7P//wucE4Go5ZExzyuXABj////iPz45hDRS4jwihODD//NExGgh0ypMAZqYABmDoWUf////45guAG2Yh4zAXOCCgyAuMUmJzEoEFGbqOpP0mHoDoSCsSKtQlSRNKrV+wsVpTcjQ5HCpah2fdnjaiOTrWOBvdM3dN9/PMJVfxzp///NExDMegyqcAY9AAP839Rq+ztAxY57ortdLnHJFqHf+KDZDtUtRxCuep5Jaqxk20wu4fqULyIAiQ8IYZ49jxguYcgUBweDcwX8Ppmi3IEEW2lBHcWkmQLI7DVILDBiA//NExAwToPKoAdhgAGHEAQtAWRF525ny/D/Pp797VPct7pmvPh8XCQBQVuf2zndm503pT+XwvrGg+wzJrEADikpQn//1yzVf60ixnI//0pp+ZprhwmaFAoJNsHTBVSQ9//NExBAR2S6QANPWcTGBV2DPJbqNDVtqt09WJ94SlNFQsKGqklDcAEWFzW1tr3Xw7g2aobHm0lbdrdreW21F2Lsn8xF1MaNi0hodEd62FaWYKEnIKQKViUREISHEJd5r//NExBsTeOpMAVtIAPFItVpaWGo1Kn+h7cqhqLCEysVFMYpodiz78a9SuKUyX7lxVARpnaIhKNET6e//////0j2A8wZiNiEzQUpRUqjZhYmsEaiBOkkc+jJpyZvSDAHK//NExCAZ4do0AZsoAFVRp0ZxpFI5UA4eDgHNMf3QYzozoqOzp57HPLZqS52dTni5zifql+6eofFw+Hx4fEy45iFkvemHxcXJpe7l2LisdA3SNUlxShRzcN6gFmFw5VoM//NExAsVUyqAAZJoABdWAWHjwX/wQgShD/E8C0CUBe//GHJc8Xzf/8lEJcb//ug3L///6fm6dP///8zNzQzNy4XEFFw0N/////8wNC+XzdZmbkoaS4XEKhvLl1U8XZNT//NExAgPcJKoAY9IAIFdLLtmxCtFqrE43oxNCDRKqzvmxp8OLO0Ub5lV4/atLn/+7q9EU1ptT3e0AqnvPvQteplISmuxSNgHsNKbiiAaUxRat1rav5DJ4xLZ7cTf+moa//NExB0R4SagAdloAGa5EaZdgLMyQJRByTN0Fpp6m2/r0G09aepCtM0E4PihBb//////++k3qoqUXoaMo4iakK8zzngXSZBTJqzAWtcm4qu2kzWYzGEeEyWWCjJcDHcx//NExCgSEUasAMvMcA3vv/3vecwhp4DCu9x/f912MVgsLM0+0ev//////+rlKp3cEBWRxOwCbDlFmKBCzKCxeFbK+svY/jIrQDcAxGwoHBNciPaY+bqSYrlsYcty+Veh//NExDIP+S60AMwUcFqQnSdn///T/6KO39ErkOUAmK6njTp+FWuKWBlCPqQE2PZZrIONZrgpxaiNQRx2JikDZ5SVTK25VmYrL3L7KMDWsvvWceorOmdgg9H////9inp+//NExEUR+SqwAMtgcN/TLM+T4CYtDiilZywjQ42QHoeTTCjedfJM9jweTRktB4HlBlArE0pRK/uH+GWvgoVuhfFXDfV92v52u97lQufvN/x+v7f////V5+Jlda4K1RUh//NExFARuTqsANNecNewLicxsC4Vfc7+ZU9sG3WMxUWGUaycLCjDQHe2v5Hd3m/itvRvUy8uTeVUkWPeDJCpDpGbl3R5LuekPMffVe64ENii8ANVszEDS8MisQCrSw5T//NExFwR0UK0AMMecTDTMObWkPXgvsDbNGzpsQl4QgLXxn9K07qd1LGQ9vklTHMXMw9u999pjLFIggNzlaW/daXNIgMpgFay7S4ZkcWSQAPdFwtKLJ67/jly9PmtLETB//NExGcRIT64AMMYcXEKjIcFZgXpONJ+WQYovZoYA044x2f2fealDvo5F0DxtRZ3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7mdqYgi64T0hLjUM//NExDoWOU6gAMFMlDv5Z8KcVOrOtyMJJFHLDQiEqgM8KFToFKiwVJXElyq/kpw2dsITOBRkouKWvI92dP8m1nnrnqaRrlIKCwQAccYVR0pn1S6NkZJpH4zhc82pMKwU//NExDQR4UqwAMFSlCUgCjyRDUHf////5RTXI2rvQXkK7URCqMZCGSkZykFMsK6HFTtamTarwbQuC8bb8A1JBG2vOXLskYeEy5NK8h92Ny80mRgZOmopoqArdP////pY//NExD8RAUa0AMCScAb/sCQBwmR0mbWADMZASYqI4gIGVTMCeIN59x5/HaNJzhIkghATglAAzjnh7/Puu0gxRjVTo/g/4p2bdbCysKar02Uie/G3f//q/o2/3ULqpckh//NExE4SkUqsAMoYlCTt2By7RI1M6JEtHM5DvwX5pe/VvSdZPaFZHMAQz5stDnzPzzrbkqNNosT+2Pvf+GZJKpoCI4Q4mL3+n//+n19dv10JTyOmIQYEhY07Zf9KC5Iu//NExFYQ6Uq0AMLMlPz3yrP+/dw3duTQ3FY2Gh0zee93/H/13cnXlJlafcPmua62nZVLZIE3B4ERUn6j////8XHf7SBtFUmC5YSgpAqnICoCqkR3mgevOSrKa/pdMWRd//NExGUScUq0AVhYAG1lgrImUfhpPuZF4pulo//WYmCLKqWi3foooEikkl1oJdtFHv6C5uqpE8yTyEUDx8kS6zWstJmSai5nTRoopu6CJ0llJJMWHDyCkFKWku7/PmJu//NExG4gqyqoAZhoAJm5gmozRUykdIqUTzhRLpskbM6RokDwBCxmURKb///p/////////9P7MRFKdKJainR6MIZAQQORjCwYG5KquZp0IiSrV1o7qpkUSU5KG1YSSYhC//NExD4RgxKwAcUQAWpTCjmUeDKVBJk92o39fX/L////////79nrZNLoVFuZ3MEylMUOigsHg9EkRY0QUxRVnQrkkYpyFHKpkKWYYwSCIsMHiRHIxhjwwSnGdz7HKePq//NExEsSkr6sAChKudLkL8TNVyMlMghBAmmUQU5DLamdt3aRilDv/8L//P6Vu+WtAwmPA1FAVUIh7qzM6Has8sBDPyp3JYWAWopQn4TSEnYNpEo4tBPAWhBgTgs8JcGI//NExFMOOKKoAHmETDcZWJTq8525bY2d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TAQZuKQQ3HHQ3M8YQh4wybmOZD7zBkgYWbMm3mHEDC0uepFhhfVin1Min7Kv2VI2NxZxP9YRobdGrxSH36sQ8KZBVQqWgdQNqH4PZgijJDQUE4NH//NExK0R+LnkAMJGTEHQcnFEy4WUEyJlVFBMHss0RpbLI0lUyrLs0rj2Wb3rZferjld+bT35Zvetl978dvfm978uvf3n3/k9GW23Z2YejMnpYvIMSFHIIkEQbKxMMwii//NExLgP6LXkAMGGTPA84dEaeePhhhVXJJJhnn2m08+88Ofe8mta//tve9///fWtKgaw3kRSTGYkzpynKh4AjZyjiRIkRIkSICAiQFWPqqqhWBoGgaPQMDQNAyCoKurB//NExMsXuNncAMpGcVBUFQWDvUDQNA0e6lgqCp1vWoKP+pbv1/6qTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqJJKD0GYB//NExL8PCH3oAMJGSQC4XA1DMDYgFNc4vEgchsIwaCGUaPR94W6eP+niWq3j47/6eU+0ydKZO8J0rE7wnSsTvFdAbKLFhFNHijiwimjglHFhKaOCUcWErE6UxYRDgOEw//NExNUSIJXUAMGGTHBYBipsE2PJmhYmZ//FTVUtKWeCwyECIaRCcakVrM6gGYz7SxqGYKGBWJB4lRRljLSEsdUXYbnDXPZWVqr90mpNhlpWtyp4ysnB4kMDQmBoOJDA//NExKwAAANIAAAAAMIMKCghYkCBhBhQUE4wEFCCBQCGcYUFBIKAQwcQKAQyDiQ1ECgEMCFiRQVDWQxIYKEcZmpNUMSwYGiz+Q1QYlW7sMSlCaaaKgxYYghw0ycGOmks//NExP8aCiG0AGIGmIScxuikeCeofpeJ6zMGyhgYIE5GRkwUKIzgqKowZFBJULf4sK4qKNxYV7P/xbqF2VirdYo38WFyPFcVIUxBTUUzLjEwMFVVVVVVVVVVTEFNRTMu//NExOkjanHUAMJGuTEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExK4Q+JWIAHsGTDEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

    async function generateQuestions(
      questionNum,
      cvId,
      job,
      additionalQuestions,
    ) {
      questions.value = [
        {
          question:
            "프로젝트에서 Spring 프레임워크와 JPA를 사용한 경험에 대해 자세히 설명해 주시겠습니까?",
          audio: audio,
          turn: 1,
        },
        {
          question:
            "다양한 데이터베이스(MySQL, MS-SQL, Oracle)를 사용한 경험을 통해 배운 주요 교훈은 무엇입니까?",
          audio: audio,
          turn: 1,
        },
        {
          question:
            "데이터베이스 사용에 대한 경험에서 얻은 가장 중요한 교훈은 무엇입니까?",
          audio: audio,
          turn: 3,
        },
        {
          question:
            "개발 도구와 기술에 대한 지식과 경험에 대해 구체적으로 설명해 주시겠어요?",
          audio: audio,
          turn: 3,
        },
        {
          question:
            "RESTful API를 설계할 때 고려해야 할 주요 사항은 무엇인가요?",
          audio: audio,
          turn: 1,
        },
      ];
    }

    /*
    async function generateQuestions(
      questionNum,
      cvId,
      job,
      additionalQuestions,
    ) {
      questions.value = [];
      audios.value = [];

      const questionCreateAPI = `https://jobjourney.shop/question/create`;
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
    persist: { enabled: true, storage: localStorage },
  },
);
