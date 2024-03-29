<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <RouterLink
      id="signUp"
      to="/signUp"
      class="q-ml-xl text-h2 text-weight-bold"
    >
      회원가입 페이지로!
    </RouterLink>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
</script>
