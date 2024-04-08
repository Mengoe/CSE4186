<template>
  <router-view />
</template>

<script setup>
import { useMemberStore } from "stores/member.js";
defineOptions({
  name: "App",
});
const { autoLogin } = useMemberStore();
</script>
