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

        <q-toolbar>
          <q-tabs
            indicator-color="transparent"
            active-color="white"
            class="tab-menu"
            align="left"
          >
            <q-btn-dropdown
              v-for="item in dropdownMenus"
              :label="item.label"
              :key="item.label"
              text-color="black"
              flat
              no-hover
            >
              <q-list>
                <q-item
                  v-for="subitem in item.subMenus"
                  :key="subitem.label"
                  :to="subitem.to"
                >
                  <q-item-section>
                    {{ subitem.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-route-tab
              v-for="item in tabMenus"
              :to="item.to"
              text-color="black"
              :label="item.label"
              :key="item.label"
              class="text-black"
            />
          </q-tabs>
          <q-btn label="logout" class="text-black" @click="logOut()" />
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { useMemberStore } from "stores/member.js";
import { useRouter } from "vue-router";

const router = useRouter();

const tabMenus = [
  { to: "/board", label: "social" },
  { to: "/", label: "about" },
];

const dropdownMenus = [
  {
    label: "interview",
    subMenus: [
      { label: "자소서 등록", to: "/cv/upload" },
      { label: "면접 보기", to: "/cv/list" },
      { label: "지난 면접 기록", to: "/interview/list" },
    ],
  },
];

function logOut() {
  useMemberStore()
    .logout()
    .then(() => {
      router.go(0);
    });
}
</script>
