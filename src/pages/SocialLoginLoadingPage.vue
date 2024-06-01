<template>
  <div>
    <p v-if="!authCode">Waiting for authorization code...</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios.js";
import { useMemberStore } from "stores/member.js";
import { useRouter } from "vue-router";
const authCode = ref(null);
const router = useRouter();

const getAuthCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  authCode.value = urlParams.get("code");
  requestAccessToken(authCode.value);
};

async function requestAccessToken(code) {
  try {
    const res = await api.post("/oauth2/google", { code: code });

    await useMemberStore().addLoginInfo(res);
    router.push("/");
  } catch (error) {
    console.log(error);
    alert("구글 로그인 인증 과정 중 실패했습니다.");
    router.push("/members/login");
  }
}
getAuthCode();
</script>
