<template>
  <q-page class="row flex-center relative">
    <q-btn
      class="absolute-top-right q-mt-xl q-mr-xl"
      size="xl"
      outline
      color="primary"
      label="홈으로"
      @click="toHome"
    ></q-btn>
    <div class="container shadow-11">
      <div id="title" class="text-h4 text-left text-primary">
        회원 정보를<br />
        입력해주세요.
      </div>
      <div id="input-form" class="q-mt-xl column flex-center">
        <q-form class="q-gutter-y-md" @submit="onSubmit">
          <q-input
            type="email"
            v-model="email"
            outlined
            hint="이메일"
            label="사용하시는 이메일을 입력해주세요."
            lazy-rules
            :rules="emailRules"
          >
          </q-input>
          <q-input
            type="password"
            v-model="password"
            outlined
            counter
            bottom-slots
            hint="비밀번호"
            label="최소 8자리/특수문자, 영문 대소문자, 숫자 조합"
            lazy-rules
            :rules="passwordRules"
          >
          </q-input>
          <q-input
            :type="!isVisible ? 'text' : 'password'"
            v-model="passwordForConfirm"
            outlined
            counter
            hint="비밀번호 확인"
            label="비밀번호를 다시 한 번 입력해주세요."
            lazy-rules
            :rules="passwordConfirmRules"
          >
            <template v-slot:append>
              <q-icon
                name="check"
                class="text-weight-bold text-positive"
                v-if="password !== '' && passwordForConfirm === password"
              >
              </q-icon>
              <q-icon
                :name="isVisible ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isVisible = !isVisible"
              ></q-icon>
            </template>
          </q-input>
          <q-input
            type="text"
            v-model="nickName"
            maxlength="10"
            counter
            outlined
            hint="닉네임"
            label="닉네임을 입력해주세요."
            lazy-rules
            :rules="nickNameRules"
          ></q-input>
          <div class="q-mt-xl">
            <q-btn
              size="xl"
              :loading="loading"
              ripple
              label="회원가입"
              type="submit"
              outline
              color="primary"
              style="width: 500px"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useUserStore } from "src/stores/user";
import { ref, reactive } from "vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { onMounted } from "vue";

import axios from "axios";

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const emailPattern = /.+@.+\..+/;
const passwordPatternForNumber = /(?=.*\d)/;
const passwordPatternForSpec = /([!@$%])/;
const passwordPatternForChar = /[a-zA-Z]/;

const email = ref("");
const password = ref("");
const passwordForConfirm = ref("");
const nickName = ref("");
const isVisible = ref(true);

const loading = ref(false);

const store = useUserStore();

const emailRules = [
  (val) => (val != null && val !== "") || "이메일을 작성해주세요.",
  (val) => emailPattern.test(val) || "이메일 형식으로 작성해주세요.",
];

const passwordRules = [
  (val) => (val != null && val !== "") || "비밀번호를 작성해주세요.",
  (val) => val.length >= 8 || "최소 8글자를 입력해주세요",
  (val) =>
    (passwordPatternForNumber.test(val) &&
      passwordPatternForSpec.test(val) &&
      passwordPatternForChar.test(val)) ||
    "특수문자, 영문 대소문자, 숫자 조합으로 작성해주세요.",
];

const nickNameRules = [
  (val) => (val !== null && val !== "") || "닉네임을 입력해주세요.",
];

const passwordConfirmRules = [
  (val) => val === password.value || "비밀번호가 일치하지 않습니다.",
];

const joinAPI =
  "https://259da068-0fdc-4898-8a3d-28d48fa2de21.mock.pstmn.io/join";

//"http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/join"; // temporary api url

// 닉네임 중복 처리는 백엔드 메시지로
function onSubmit() {
  // axios post request
  let savedData = {};
  savedData.email = email.value;
  savedData.password = password.value;
  savedData.nickName = nickName.value;
  loading.value = true;

  try {
    // send post request
    axios
      .post(joinAPI, JSON.stringify(savedData), {
        headers: {
          "Content-Type": `application/json`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.errorCode === 400) {
          // notify error message using $q
          $q.notify({
            position: "center",
            icon: "done",
            color: "negative",
            message: `${response.data.errorMessage}`,
            timeout: 800,
          });
        } else {
          // notify success message using $q
          $q.notify({
            position: "center",
            icon: "done",
            color: "primary",
            message: `${response.data.message}`,
            timeout: 800,
          });

          // save user's metadata to user store
          store.email = savedData.email;
          store.password = savedData.password;
          store.nickName = savedData.nickName;

          // route to login page
          router.push("/members/login");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        loading.value = false;
      });
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

function toHome() {
  router.push("/");
}
</script>

<style lang="scss" scoped>
#title {
  line-height: 1.2;
  font-weight: 600;
}
.q-field__control {
  width: 500px;
}

.q-field__messages {
  font-weight: bold;
  font-family: sans-serif;
  color: $dark;
}

.container {
  padding: 100px;
}
</style>
