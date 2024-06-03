<template>
  <q-layout view="hhh LpR fff">
    <q-header bordered class="header-class text-wsfont">
      <div class="top-menu">
        <a href="/">
          <img
            src="../assets/main-logo.png"
            alt="AI Interview Logo"
            class="main-logo"
            style="z-index: 1"
          />
        </a>
        <q-toolbar>
          <q-tabs
            indicator-color="transparent"
            active-color="white"
            class="tab-menu l70"
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

          <q-btn
            label="로그아웃"
            rounded
            class="text-black login-button"
            @click="logOut()"
          />
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
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
defineOptions({
  name: "BasicLayout",
});
const memberStore = useMemberStore();
const { isLogin } = storeToRefs(memberStore);
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
      router.replace("/");
    });
}
</script>

<style scoped>
.l70 {
  position: absolute;
  left: 70px;
}

.login-button {
  width: 125px;
  height: 36px;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
