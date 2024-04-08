import { useMemberStore } from "stores/member.js";
import { storeToRefs } from "pinia";
const routes = [
  {
    path: "/",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      { path: "", component: () => import("pages/MainPage.vue") },
      { path: "interview", component: () => import("pages/InterviewPage.vue") },
      {
        path: "cvUpload",
        component: () => import("pages/CvUpload.vue"),
        beforeEnter: (to, from, next) => {
          const { isLogin } = storeToRefs(useMemberStore());
          if (!isLogin.value)
            next({ path: "/members/login", query: { redirect: to.fullPath } });
          else next();
        },
      },
      {
        path: "cvList",
        component: () => import("pages/CvList.vue"),
        beforeEnter: (to, from, next) => {
          const { isLogin } = storeToRefs(useMemberStore());
          if (!isLogin.value)
            next({ path: "/members/login", query: { redirect: to.fullPath } });
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
  {
    path: "/board",
    component: () => import("layouts/BoardLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/BoardPage.vue"),
      },
      {
        path: ":id",
        component: () => import("pages/PostDetailPage.vue"),
      },
      {
        path: "post",
        component: () => import("pages/AddPostPage.vue"),
      },
    ],
    beforeEnter: (to, from, next) => {
      const { isLogin } = storeToRefs(useMemberStore());
      if (!isLogin.value)
        next({ path: "/members/login", query: { redirect: to.fullPath } });
      else next();
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
