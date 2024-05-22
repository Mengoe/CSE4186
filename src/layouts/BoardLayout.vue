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
        <span
          class="text-weight-bold q-ml-md"
          style="color: black; white-space: nowrap"
          >커뮤니티</span
        >
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
import EssentialLink from "components/EssentialLink.vue";
import { ref } from "vue";
import { useMemberStore } from "stores/member.js";
import { useRouter } from "vue-router";

const router = useRouter();

const leftDrawerOpen = ref(false);

const dropdownMenus = [
  {
    label: "interview",
    subMenus: [
      { label: "자소서 등록", to: "/cvUpload" },
      { label: "면접 보기", to: "/cvList" },
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
