<template>
  <q-page class="flex flex-center">
    <div class="login-form">
      <b>로그인 페이지</b>
      <div class="q-pa-md">
        <q-input
          v-model="email"
          filled
          type="text"
          hint="Email"
          style="width: 400px"
          maxlength="30"
        />
        <q-input
          v-model="password"
          filled
          type="text"
          hint="Password"
          style="width: 400px"
          maxlength="15"
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
      <q-btn @click="onSubmit()">로그인</q-btn>
      <a href="/members/join" style="text-decoration-color: black; color: black"
        >회원가입</a
      >
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useMemberStore } from "stores/member.js";
const email = ref("");
const password = ref("");
function onSubmit() {
  const loginObj = {
    email: this.email,
    password: this.password,
  };
  if (useMemberStore.login(loginObj)) {
    window.location.href = "/";
  } else {
    location.reload();
  }
}

defineOptions({
  name: "LoginPage",
});
</script>
