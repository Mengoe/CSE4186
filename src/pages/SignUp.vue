<template>
  <q-page class="row flex-center">
    <div class="container relative-position shadow-11">
      <q-btn
        class="absolute-top-right q-mt-xl q-mr-xl"
        size="lg"
        outline
        color="primary"
        label="홈으로"
        to="/"
      ></q-btn>
      <div id="title" class="text-h4 text-left text-primary">
        회원 정보를<br />
        입력해주세요.
      </div>
      <div id="input-form" class="q-mt-xl column flex-center">
        <q-form class="q-gutter-y-md" @submit="onSubmit">
          <div class="email-region row no-wrap">
            <q-input
              class="col-10"
              type="email"
              v-model="email"
              outlined
              hint="이메일"
              label="사용하시는 이메일을 입력해주세요."
              lazy-rules
              :rules="emailRules"
              :readonly="isDoneEmailCheck"
              icon="check"
            >
            </q-input>
            <q-btn
              :loading="emailCheckLoading"
              class="col-2 q-ml-xs check-button"
              outline
              color="primary"
              @click="emailDuplicateCheck"
              :disable="isDoneEmailCheck"
            >
              <div v-if="!isDoneEmailCheck">중복확인</div>
              <div v-else><q-icon name="check"></q-icon></div>
            </q-btn>
          </div>
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
                :name="!isVisible ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isVisible = !isVisible"
              ></q-icon>
            </template>
          </q-input>
          <div class="email-region row no-wrap">
            <q-input
              class="col-10"
              type="text"
              v-model="nickName"
              maxlength="10"
              counter
              outlined
              hint="닉네임"
              label="닉네임을 입력해주세요."
              lazy-rules
              :readonly="isDoneNameCheck"
              :rules="nickNameRules"
            ></q-input>
            <q-btn
              :loading="nameCheckLoading"
              class="col-2 q-ml-xs check-button"
              outline
              color="primary"
              @click="nameDuplicateCheck"
              :disable="isDoneNameCheck"
            >
              <div v-if="!isDoneNameCheck">중복확인</div>
              <div v-else><q-icon name="check"></q-icon></div>
            </q-btn>
          </div>
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
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useMemberStore } from "src/stores/member";

const router = useRouter();
const $q = useQuasar();
const memberStore = useMemberStore();

const emailPattern = /.+@.+\..+/;
const passwordPatternForNumber = /(?=.*\d)/;
const passwordPatternForSpec = /([!@$%])/;
const passwordPatternForChar = /[a-zA-Z]/;

const email = ref("");
const password = ref("");
const passwordForConfirm = ref("");
const nickName = ref("");
const isVisible = ref(true);

// 회원가입 제출 후 로딩
const loading = computed(() => memberStore.loading);

const emailCheckLoading = ref(false);
const nameCheckLoading = ref(false);
const isDoneEmailCheck = ref(false);
const isDoneNameCheck = ref(false);

const emailRules = [
  (val) => (val != null && val !== "") || "이메일을 입력해주세요.",
  (val) => emailPattern.test(val) || "이메일 형식으로 입력해주세요.",
];

const passwordRules = [
  (val) => (val != null && val !== "") || "비밀번호를 입력해주세요.",
  (val) => val.length >= 8 || "최소 8글자를 입력해주세요",
  (val) =>
    (passwordPatternForNumber.test(val) &&
      passwordPatternForSpec.test(val) &&
      passwordPatternForChar.test(val)) ||
    "특수문자, 영문 대소문자, 숫자 조합으로 입력해주세요.",
];

const nickNameRules = [
  (val) => (val !== null && val !== "") || "닉네임을 입력해주세요.",
];

const passwordConfirmRules = [
  (val) => val === password.value || "비밀번호가 일치하지 않습니다.",
];

async function emailDuplicateCheck() {
  const rules = [
    (val) => val != null && val !== "",
    (val) => emailPattern.test(val),
  ];

  const errorMessages = rules
    .map((rule) => rule(email.value))
    .filter((ele) => ele === false);

  if (errorMessages.length !== 0) {
    $q.notify({
      message: "이메일을 올바르게 입력해주세요.",
      color: "negative",
      timeout: 300,
      position: "center",
    });

    return;
  }

  emailCheckLoading.value = true;

  try {
    await memberStore.duplicateCheck({
      name: "",
      email: email.value,
      password: "",
    });

    $q.notify({
      message: "사용 가능한 이메일입니다.",
      color: "positive",
      timeout: 300,
      position: "center",
    });
    isDoneEmailCheck.value = true;
  } catch (err) {
    console.log(err);
    $q.notify({
      message: "다른 이메일을 사용해주세요.",
      color: "negative",
      timeout: 300,
      position: "center",
    });
  } finally {
    emailCheckLoading.value = false;
  }
}

async function nameDuplicateCheck() {
  if (nickName.value === null || nickName.value === "") {
    $q.notify({
      message: "닉네임을 입력해주세요.",
      color: "negative",
      timeout: 300,
      position: "center",
    });

    return;
  }

  nameCheckLoading.value = true;

  try {
    await memberStore.duplicateCheck({
      name: nickName.value,
      email: "",
      password: "",
    });

    isDoneNameCheck.value = true;
    $q.notify({
      message: "사용 가능한 닉네임입니다.",
      color: "positive",
      timeout: 300,
      position: "center",
    });
  } catch (err) {
    console.log(err);
    $q.notify({
      message: "다른 닉네임을 사용해주세요.",
      color: "negative",
      timeout: 300,
      position: "center",
    });
  } finally {
    nameCheckLoading.value = false;
  }
}

function onSubmit() {
  if (!isDoneEmailCheck.value || !isDoneNameCheck.value) {
    $q.notify({
      message: "이메일, 닉네임 중복체크를 완료해주세요.",
      color: "negative",
      timeout: 300,
      position: "center",
    });
    return;
  }

  memberStore.join({
    name: nickName.value,
    email: email.value,
    password: password.value,
  });
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

.check-button {
  height: 56px;
}
</style>
