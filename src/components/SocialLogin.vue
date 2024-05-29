<template>
  <div class="socialLoginButton">
    <q-btn
      class="login-button"
      icon="img:/google-logo.svg"
      label="구글 계정으로 로그인"
      :href="backendGoogleApi"
    />
  </div>
</template>

<style scoped>
.login-button {
  color: black; /* 버튼의 텍스트 색상을 파란색으로 설정 */
  border-style: solid; /* 테두리 스타일을 실선으로 설정 */
  border-width: 0.5px;
  border-color: grey;
  width: 250px;
  height: 50px;
  font-weight: bold;
}
</style>

<script setup>
const backendGoogleApi = "https://jobjourney.shop/login/oauth2/google";
</script>
