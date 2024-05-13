<template>
  <q-page class="flex flex-center">
    <div class="login-form">
      <strong>이메일로 로그인</strong>
      <div class="q-pa-md">
        <q-input
          v-model="email"
          filled
          type="text"
          label="Email"
          @blur="
            () => {
              emailBlurred = true;
            }
          "
          :error="validateEmail != 0 && emailBlurred"
          :error-message="emailError"
          style="width: 400px"
          autofocus
        >
          <template v-slot:error> </template>
        </q-input>
        <q-input
          v-model="password"
          filled
          :type="isPwd ? 'password' : 'text'"
          label="Password"
          style="width: 400px"
          @blur="
            () => {
              passwordBlurred = true;
            }
          "
          :error="!validatePassword && passwordBlurred"
          :error-message="passwordError"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <q-btn
        @click="onSubmit()"
        :disable="!validatePassword || validateEmail != 0"
        >로그인</q-btn
      >
      <SocialLoginButton />
      <RouterLink
        to="/members/join"
        style="text-decoration-color: black; color: black"
        >회원가입</RouterLink
      >
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useMemberStore } from "stores/member.js";
import { RouterLink, useRouter, useRoute } from "vue-router";
import SocialLoginButton from "components/SocialLogin.vue";

const router = useRouter();
const route = useRoute();
const email = ref("");
const password = ref("");
const isPwd = ref(true);
const emailBlurred = ref(false);
const passwordBlurred = ref(false);
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
const memberStore = useMemberStore();
const validateEmail = computed(() => {
  if (!email.value) return 1;
  else if (!emailRegex.test(email.value)) return 2;
  else return 0;
});
const validatePassword = computed(() => {
  return password.value;
});
const passwordError = "비밀번호를 입력해주세요.";
const emailError = computed(() => {
  return validateEmail.value == 1
    ? "이메일을 입력하세요"
    : "유효하지 않은 이메일 형식입니다.";
});
async function onSubmit() {
  const loginObj = {
    email: this.email,
    password: this.password,
  };
  useMemberStore()
    .login(loginObj)
    .then(() => {
      router.push(route.query.redirect || "/");
    })
    .catch((err) => {
      console.log("here");
      alert("로그인에 실패하셨습니다.다시 시도해주세요.");
      console.log(err);
      router.push("/members/login");
    });
}

defineOptions({
  name: "LoginPage",
});
</script>
