<template>
  <q-layout view="hhh LpR fff">
    <q-header bordered class="header-class">
      <div class="top-menu">
        <a href="/">
          <img
            src="../assets/ai-interview-logo.jpg"
            alt="AI Interview Logo"
            class="main-logo"
          />
        </a>
        <p style="color: black">게시판</p>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
