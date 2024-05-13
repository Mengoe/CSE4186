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
    const count = ref(0);

    function mergeAdditionalQuestions(newQuestions) {
      questions.value = [...questions.value, ...newQuestions];
    }

    async function generateQuestions(questionNum, content) {
      questions.value = [];

      const questionCreateAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/question/create`;
      const accessToken = Cookies.get("access_token");
      count.value = count.value + 1;
      const cvObj = {
        questionNum,
        content: `1. 지원한 이유와, 입사 후 회사에서 이루고 싶은 꿈을 기술하시오. (700자)
        5학기 때, 시스템 관련 전공을 수강 하면서 시스템 소프트웨어 분야에 관심이 생겼습니다. 컴퓨터나 스마트폰에서 여러 개의 프로그램을 동시에 사용하는 등, 당연하게 생각했던 것을 가능하게 해주는 것은 시스템 소프트웨어의 도움 덕분이라는 것을 알게 되었기 때문입니다. 그래서 자연스럽게 시스템 소프트웨어 개발자를 목표로 하고 있었습니다.

        그런데 마침 학기가 시작하고 얼마 후 취업 박람회가 열렸습니다. 그곳에서, 삼성 전자 DS System LSI 사업부에서 SW 직무를 수행하고 있는 임직원분과 상담할 기회가 생겼습니다. 상담을 하며 LSI 사업부의 업무 및 기술적인 부분에 대한 이야기를 들었습니다. 업무에 관해, 다양한 Mobile Solution을 개발하고 이를 SOC 에 탑재해 하나의 완성된 AP를 만들어낸다는 것이 매력적으로 느껴졌습니다. 또한, 로우 레벨에서 개발을 한다는 점 역시 시스템 소프트웨어 개발자로서 성장할 수 있는 굉장히 좋은 환경이라고 생각해 지원하였습니다.
        상담을 하는 짧은 시간 동안, 사용되는 기술들에 대해 쉬우면서도 정확하게 설명해주시는 임직원분을 보면서 저도 이 회사에 입사해 이 분과 같은 뛰어난 엔지니어들과 함께 일하며 성장해 나가고 싶다는 생각을 하였습니다. 입사 후, 반도체 시장의 선두주자인 삼성전자 DS 부서의 일원으로서 최고의 실력을 갖출 수 있도록 꾸준히 노력하겠습니다.

        2. 본인의 성장과정을 간략하게 기술하되 현재의 자신에게 가장 큰 영향을 끼친 사건, 인물 등을 포함하여 기술하시기 바랍니다. (1500자)
        [후회 없는 삶을 살자]

        “후회 없이 사는 것” 은 제가 가장 중요하게 생각하는 점입니다. 작년 5월 말, 별탈 없던 군 생활 중 상상도 못했던 일이 일어났습니다. 물건 옮기는 작업을 하던 중 오른쪽 엄지 손가락을 크게 다친 것입니다. 그 당시 의사의 말은 다음과 같았습니다. “수술이 잘 되지 않으면 정상적으로 엄지를 사용하기 힘들 것이고, 잘 되더라도 기존의 60% 정도밖에 제 기능을 못할 것이다.”
        처음 이 말을 들었을 때 굉장히 좌절했습니다. 글씨를 쓰고, 운동을 하는 등 일상생활에 있어 엄지의 역할은 굉장히 크기 때문입니다. 이런 것들을 정상적으로 할 수 없는 미래를 생각하니 마음을 달래기 쉽지 않았습니다.

        수술 후, 한 달 동안 입원을 하게 됐습니다. 우울에 사로잡혀 누워있기만 하던 중, 불현듯 “앞으로는 정말 후회 없는 삶을 살아야겠다” 라는 생각이 났습니다. 만약 살면서 또 이러한 사고가 발생해 무언가 하고 싶어도 못하는 상황이 왔을 때, 의미 없게 보낸 시간들을 생각하면 너무나도 후회할 것 같았기 때문입니다. 이 생각을 한 후부터 저는 달라지기 시작했습니다. 만약의 상황을 대비해 왼손으로 글씨 연습을 계속 하였고, 누워만 있기보단 산책이나 독서를 하며 점차 몸과 마음의 건강을 회복할 수 있었습니다.
        퇴원을 한 뒤 현재까지 꾸준히 재활을 한 결과, 다행히 일상생활에 지장이 없을 정도까지 회복하였습니다. 이런 힘든 시기를 극복하고, 혼자만의 시간을 보내며 형성된 가치관은 복학 후 학업 수행에 큰 도움을 주었고 삶을 살아가는 데에 있어 제 선택의 기준이 되었습니다.

        [끈기와 노력의 중요성을 다시 한 번 느끼다]

        어려운 상황에 처하거나 무언가 큰 벽을 느꼈을 때, 끈기를 가지고 꾸준히 노력한다면 무엇이든 해낼 수 있다고 생각합니다. 올해 복학을 하고 세웠던 목표는 좋은 학점을 받는 것이었습니다. 하지만, 공부 과정에서 큰 어려움이 있었습니다. 전공 과목 모두 저학년 때 배운 내용을 기본으로 하는 심화된 내용이었고, 여러 과목에서 프로젝트가 동시에 쏟아져 나왔기 때문입니다. 군 생활을 하면서 전공 내용의 상당 부분을 잊어버려 수업을 따라 가기 힘든 상황에, 계속해서 과제까지 나오니 정말 막막하였습니다.
        그러나 저는 포기하지 않았습니다. 수업을 들으며 이해가 안되는 부분은 교수님께 질문드려 최대한 그날 이해하려고 노력하였고, 매일 복습을 하였습니다. 그리고 잊어버렸던 내용이 나오면 전공 서적과 블로그를 찾아보며 공부하였습니다. 그 결과, 모든 과목에서 우수한 성적을 거둘 수 있었습니다.

        한 학기라는 짧은 시간 동안 새로운 내용을 배운 뒤 이를 바탕으로 프로젝트를 진행하고 완성하는 과정에서, 새로운 분야를 배우는 것에 대한 두려움을 떨쳐내는 계기가 되었습니다. 또한, 꾸준히 노력하여 어려움을 극복하고 학업적 성취를 이뤘던 경험은 제게 어떤 과제가 주어져도 결국 해낼 수 있을 것이란 자신감을 갖게 해주었습니다. 이러한 역량은 끊임없이 새로운 도전이 주어지는 회사에서 빛을 발할 것이라고 생각합니다.


        3. 최근 사회이슈 중 중요하다고 생각되는 한 가지를 선택하고 이에 관한 자신의 견해를 기술해주세요. (1000자)
        [탄소 중립, 어떻게 달성할 수 있을까]

        최근 몇년 간 전 세계적으로 폭염, 가뭄으로 인한 대규모 산불, 폭우 등으로 인한 피해가 자주 발생하였고 규모 또한 커지고 있습니다. 지구 평균 기온 상승으로 인해 기후가 급격하게 변화하고 있기 때문입니다. 불과 며칠 전, 리비아에서 강력한 열대성 폭풍으로 인해 댐이 무너져 도시가 초토화되고 수천 명이 사망하는 일이 발생했습니다. 이는 급격한 기후 변화가 얼마나 큰 피해를 초래할 수 있는지 보여줍니다.

        이러한 기후 변화 문제를 인식하고 전 세계가 탄소 중립을 위해 노력하고 있습니다. 우리나라 또한, 삼성전자를 포함해 다른 기업들도 탄소 배출량을 줄이기 위해 노력하고 있습니다. 하지만, 탄소 중립을 달성하기 위해선 단순히 노력하는 것에만 그치는 것이 아니라 기업 간의 협력이 필요합니다. 기업 간 협력을 통해 기업들이 소비자에게 탄소 배출량을 줄이기 위해 어떤 노력을 하고 있는지, 왜 이러한 노력을 하는지 등을 적극적으로 홍보해야 할 것입니다. 소비자가 이와 같은 홍보를 지속적으로 접하면서, 점차 탄소 배출 감소의 중요성을 느끼고 실천하게 될 것이기 때문입니다. 이 소비자들이 일상생활에서 탄소 배출을 줄이기 위해 노력한다면, 그 주변인들도 긍정적인 영향을 받을 것입니다. 이러한 선순환이 탄소 중립을 위한 변화의 시작점이 될 것입니다.

        최근에는 '기후 변화' 라는 용어 대신 '기후 위기' 라는 용어를 사용한다고 합니다. 기후 변화가 인간의 삶을 위협할 정도가 됐다는 것입니다. 기후 변화 문제 해결을 위해 기업이 탄소 배출량을 줄이는 것도 정말 중요하지만, 선순환을 바탕으로 우리 모두가 기후 변화를 '자신의 일'이라고 여기는 것 또한 중요합니다. 이러한 인식의 변화를 통해, 결국 우리는 탄소 중립이라는 궁극적인 목표를 달성할 수 있을 것입니다.


        4.  지원한 직무 관련 본인이 갖고 있는 전문지식/경험(심화전공, 프로젝트, 논문, 공모전 등)을 작성하고, 이를 바탕으로 본인이 지원 직무에 적합한 사유를 구체적으로 서술해 주시기 바랍니다.(1000자)
        DS 부서에서 소프트웨어 개발자는 펌웨어 혹은 시스템 소프트웨어를 개발합니다. 직무 수행을 위해 하드웨어와 시스템에 대한 전반적인 이해를 바탕으로, 이를 실제 제품 개발에 적용할 수 있는 능력이 필요합니다.

        필요 역량 향상을 위해, 컴퓨터 아키텍쳐를 수강하면서 하드웨어에 대한 이해를 높일 수 있었습니다. 멀티코어 프로그래밍 과목을 통해 시스템에 대한 전반적인 개념을 익혔습니다. 시스템에 대한 이해를 바탕으로, 실제 쉘 프로그램을 만들며 개념을 적용해보았습니다.
        쉘 구현 시 가장 어려웠던 부분은 Background Job에 대한 처리였습니다. 레이스 컨디션이 빈번하게 발생했기 때문입니다. 이를 해결하기 위해, 공유 자료구조 접근 시 시그널을 블록해주거나, volatile 변수를 이용해 메인 코드와 시그널 핸들러를 스케줄링 해주었습니다. 그 결과 레이스 컨디션 없이 올바르게 동작하는 프로그램을 완성할 수 있었습니다.

        이와 더불어, 삼성 하계 알고리즘 역량 강화 특강을 수료해 C++ 를 이용한 알고리즘 해결 역량을 키웠습니다.

        [자료구조 응용 및 분석을 통한 성능 개선]

        C언어의 Malloc 함수를 구현하는 프로젝트를 진행했습니다. 명시적 가용 리스트로 빈 블록들을 관리하였고, 처리 속도를 높이기 위해 처음에는 최초 적합 방식으로 힙 공간의 빈 블록을 찾는 식으로 구현했습니다. 이 방법은 처리 속도는 높았지만 메모리 활용성이 매우 안 좋았습니다. 메모리 활용성 개선을 위해, 빈 블록 리스트에 블록이 삽입될 때 리스트가 블록 크기에 대한 오름차순이 되도록 하였습니다. 또한, 힙 공간을 확장하거나 블록을 나눌 때 기준이 되는 값을 조정해 최적의 성능을 내도록 하였습니다. 이 방법을 통해 비교적 빠른 속도로 요청들을 처리하면서, 메모리 활용성을 10% 정도 증가 시킬 수 있었습니다.

        이러한 경험을 통해, 업무 중 문제 발생 시 빠르게 해결책을 찾을 수 있도록 노력하겠습니다. 또한, 기능 개발에 안주하지 않고 최적화를 통한 성능 향상에 힘쓰겠습니다.
        `,
      };

      // console.log(cvObj);
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

        const jsonResponse = await response.json();
        console.log(jsonResponse);
        if (jsonResponse.result == "fail") throw new Error("질문 생성 에러");

        const json = JSON.parse(jsonResponse.body);
        console.log(json.questions);
        questions.value = json.questions;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    }

    function fetchAllCv() {
      cvLists.value = [];

      const userId = useMemberStore().userId;
      const getCvListAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/selfIntroduction/List/${userId}`;

      console.log(userId);
      const accessToken = Cookies.get("access_token");

      loading.value = true;

      axios
        .get(getCvListAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          console.log("fetchAllCv Succeed");
          cvLists.value = res;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          loading.value = false;
        });
    }

    function addCv(title, content) {
      return new Promise((resolve, reject) => {
        const addCvAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/selfIntroduction/Save`;
        const userId = useMemberStore().userId;

        const accessToken = Cookies.get("access_token");

        const cvObj = {
          title,
          id: userId,
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
      count,
      mergeAdditionalQuestions,
      generateQuestions,
      fetchAllCv,
      addCv,
    };
  },
  {
    persist: true,
  },
);
