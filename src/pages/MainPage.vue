<template>
  <q-page class="relative">
    <div>
      <div class="left-content"></div>
      <div class="right-content">
        <GradientBackground class="gradient-background" />
      </div>
      <div class="whole-content">
        <div class="main-logo">
          <a href="/">
            <img
              src="../assets/main-logo.png"
              alt="Main Logo"
              height="auto"
              width="60px"
            />
          </a>
          <div class="mkr">your interview journey</div>
        </div>
        <q-btn
          v-if="!isLogin"
          class="login-button text-description"
          rounded
          href="/members/login"
        >
          <span class="text-description" style="color: black"
            >회원가입/로그인</span
          >
        </q-btn>
        <q-btn
          v-else
          class="login-button text-description"
          rounded
          @click="logoutHandler()"
        >
          <span class="text-description" style="color: black">로그아웃</span>
        </q-btn>
        <div class="title">
          <span
            v-for="(char, index) in displayedText"
            :key="index"
            v-html="char === '<br>' ? '<br>' : char"
            class="fade-in"
            :style="char !== '<br>' ? charStyle(index) : {}"
          >
          </span>
        </div>
        <div class="flex-container t350l5">
          <div
            v-for="(feature, index) in websiteFeatures"
            :key="index"
            class="flex-items"
          >
            <a
              :href="feature.link"
              class="link-wrapper"
              @mouseenter="handleFocus(index)"
              @mouseleave="handleBlur(index)"
            >
              <q-icon
                :name="feature.icon"
                size="80px"
                :color="isFocused[index] ? 'blue' : 'grey'"
              />
              <div class="text-label">
                {{ feature.label }}
              </div>
              <div class="text-description">
                {{ feature.description }}
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import GradientBackground from "components/GradientBackground.vue";
import { onMounted, ref } from "vue";
import { useMemberStore } from "stores/member";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const memberStore = useMemberStore();
const { isLogin } = storeToRefs(memberStore);

const displayedText = ref([]);
const text = "완벽한 면접을 위한\n개발자들의 연습 공간";
const typingSpeed = 50;
let curId = 0;

const router = useRouter();

const logoutHandler = () => {
  useMemberStore()
    .logout()
    .then(() => {
      router.go(0);
    });
};

const startTyping = () => {
  if (curId < text.length) {
    if (text.charAt(curId) === "\n") {
      displayedText.value.push("<br>");
    } else {
      displayedText.value.push(text.charAt(curId));
    }
    curId++;
    setTimeout(startTyping, typingSpeed);
  }
};

onMounted(() => {
  startTyping();
});

const textStyle = [
  { color: "#D7567F", fontSize: "60px", fontWeight: "bold" } /*분홍색*/,
  { color: "#1E3269", fontSize: "60px", fontWeight: "bold" } /*남색*/,
  { color: "#1E90FF", fontSize: "60px", fontWeight: "bold" } /*파란색*/,
  { color: "#1E3269", fontSize: "60px", fontWeight: "bold" },
];

function charStyle(index) {
  const style = [
    0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 1, 1, 1, 1, 1, 1,
  ];
  return textStyle[style[index]];
}

const websiteFeatures = [
  {
    label: "자소서 등록하기",
    icon: "description",
    description: "AI가 면접 질문을 생성할 수 있도록 자소서를 등록해주세요",
    link: "cv/upload",
  },
  {
    label: "맞춤형 면접 보기",
    icon: "interpreter_mode",
    description: "직무, 면접 질문 수 등을 입력하고 실전 면접에 돌입해보세요",
    link: "cv/list",
  },
  {
    label: "면접 피드백/공유하기",
    icon: "reviews",
    description:
      "본인의 면접을 평가받고 다른 사람의 면접을 보며 피드백해보세요",
    link: "board/list",
  },
];
const isFocused = ref([false, false, false]);

function handleBlur(index) {
  isFocused.value[index] = false;
}
function handleFocus(index) {
  isFocused.value[index] = true;
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/static/complete/WantedSans.min.css");

.relative {
  position: relative;
  width: 100%;
  height: 100%;
}

.left-content {
  width: 60%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.right-content {
  width: 40%;
  height: 100%;
  overflow: hidden; /* 클립 패스 외부의 요소를 숨기기 위해 */
  position: absolute;
  right: 0;
  top: 0;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 100%);
  background-color: lightgrey;
}

.gradient-background {
  width: calc(100% - 2px);
  height: 100vh;
  position: absolute;
  left: 2px;
  top: 0;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 70% 100%);
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s forwards;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

.title {
  position: absolute;
  top: 120px;
  left: 5%;
  z-index: 1; /* Ensure the text appears above other content */
  text-align: left;
  white-space: nowrap;
  display: inline-block;
  font-family: "Wanted Sans";
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.main-logo {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 400px;
  height: 60px;
  display: flex;
}

.mkr {
  font-family: "Wanted Sans";
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  border-left-width: 10px;
  border-top-width: 7px;
  border-color: transparent;
  color: #000;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
  height: 250px;
}

.flex-items {
  height: 200px;
  width: 200px;
}

.t350l5 {
  position: absolute;
  top: 350px;
  left: 5%;
}

.text-label {
  font-family: "Wanted Sans";
  font-weight: bold;
  font-size: 20px;
}

.text-description {
  font-family: "Wanted Sans";
}

.link-wrapper {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.login-button {
  position: absolute;
  top: 30px;
  left: 50%;
  width: 125px;
  height: 36px;
}
</style>
