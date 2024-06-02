<template>
  <q-layout view="hhh LpR fff">
    <q-header bordered class="header-class">
      <div class="top-menu">
        <a href="/">
          <img
            src="../assets/main-logo.png"
            alt="AI Interview Logo"
            class="main-logo"
          />
        </a>
        <p class="text-black l70t20 font-weight-bold">Members</p>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.l70t20 {
  position: absolute;
  left: 70px;
  top: 20px;
}
</style>
