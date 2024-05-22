<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    <div class="column q-gutter-y-xl">
      <RouterLink to="/signUp" class="q-ml-xl text-h2 text-weight-bold">
        회원가입 페이지로!
      </RouterLink>
      <RouterLink to="/cv/upload" class="q-ml-xl text-h2 text-weight-bold">
        자기소개서 업로드하기!
      </RouterLink>
    </div>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "IndexPage",
});
</script>
