import { useMemberStore } from "stores/member.js";
import { storeToRefs } from "pinia";

const routes = [
  {
    path: "/",
    component: () => import("layouts/HomePageLayout.vue"), // MainPage를 위한 다른 레이아웃
    children: [{ path: "", component: () => import("pages/MainPage.vue") }],
  },

  {
    path: "/interview",
    component: () => import("layouts/HomePageLayout.vue"),
    children: [
      { path: "", component: () => import("pages/InterviewPage.vue") },
      {
        path: "list",
        component: () => import("pages/InterviewListPage.vue"),
      },
      {
        path: "finish",
        component: () => import("pages/FinishInterviewPage.vue"),
      },
    ],
  },
  {
    path: "/cv",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      {
        path: "upload",
        component: () => import("pages/CvUpload.vue"),
        beforeEnter: (to, from, next) => {
          const { isLogin } = storeToRefs(useMemberStore());
          if (!isLogin.value)
            next({ path: "/members/login", query: { redirect: to.fullPath } });
          else next();
        },
      },
      {
        path: "list",
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
      {
        path: "callback",
        component: () => import("pages/SocialLoginLoadingPage.vue"),
      },
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
      {
        path: "edit",
        component: () => import("pages/UpdatePostPage.vue"),
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
