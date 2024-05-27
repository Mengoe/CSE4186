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
        <p class="text-black l70t10 font-weight-bold">Members</p>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.main-logo {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 55px;
  height: auto;
}
.l70t10 {
  position: absolute;
  left: 70px;
  top: 20px;
}
</style>
