<template>
  <div>
    <p v-if="!authCode">Waiting for authorization code...</p>
    <p v-else>Loading...</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios.js";
const authCode = ref(null);

const getAuthCode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  authCode.value = urlParams.get("code");
  if (authCode.value) {
    requestAccessToken(authCode.value);
  }
};

async function requestAccessToken(code) {
  try {
    //await api.post();
  } catch (error) {
    console.error(
      "Failed to exchange authorization code for access token",
      error,
    );
  }
}
getAuthCode();
</script>
