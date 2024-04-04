import { useMemberStore } from "stores/member.js";
import { storeToRefs } from "pinia";
const routes = [
  {
    path: "/",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      { path: "", component: () => import("pages/MainPage.vue") },
      {
        path: "cvUpload",
        component: () => import("pages/CvUpload.vue"),
        beforeEnter: (to, from, next) => {
          const { isLogin } = storeToRefs(useMemberStore());
          if (!isLogin.value) next("/members/login");
          else next();
        },
      },
    ],
  },
  {
    path: "/members",
    component: () => import("layouts/MembersLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("pages/LoginPage.vue"),
      },
      { path: "join", component: () => import("pages/SignUp.vue") },
    ],
    beforeEnter: (to, from, next) => {
      const { isLogin } = storeToRefs(useMemberStore());
      if (!isLogin.value) next();
      else next("/");
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];
export default routes;
