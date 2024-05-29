<template>
  <q-page class="relative-position bg-grey-1">
    <div class="container row justify-around absolute-center">
      <div class="login-form column flex-center">
        <div class="text-weight-bold text-h4">Sign In</div>
        <SocialLoginButton />
        <div class="text-grey-6">또는 이메일로 로그인</div>
        <div class="q-pa-md q-gutter-y-md">
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
          class="btn"
          @click="onSubmit()"
          :disable="!validatePassword || validateEmail != 0"
          color="primary"
          rounded
          size="lg"
          >로그인
        </q-btn>
      </div>
      <div class="signup-form column flex-center relative-position">
        <div class="text-h4 text-weight-bold">반가워요 !</div>
        <div class="text-grey-6 q-mt-lg">
          계정이 없으신가요?<br />가입하여 면접을 대비해보세요!
        </div>
        <q-btn
          class="btn q-mt-xl"
          color="primary"
          size="lg"
          rounded
          to="/members/join"
          >회원가입</q-btn
        >
      </div>
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
    email: email.value,
    password: password.value,
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
<style lang="scss" scoped>
.container {
  height: 80%;
  width: 70%;
  border-radius: 10px;
  box-shadow:
    10px 10px 10px $grey-5,
    -15px -15px 15px white;

  .login-form {
    flex: 1.8;
    background-color: $grey-1;
  }

  .signup-form {
    flex: 1;
    box-shadow: -5px -5px 10px white;
  }
}

.btn {
  width: 170px;
  height: 50px;
}
</style>
