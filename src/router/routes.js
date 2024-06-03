import { useMemberStore } from "stores/member.js";
import { storeToRefs } from "pinia";
const routes = [
  {
    path: "/",
    component: () => import("layouts/HomePageLayout.vue"), // MainPage를 위한 다른 레이아웃
    children: [{ path: "", component: () => import("pages/MainPage.vue") }],
    beforeEnter: (to, from, next) => {
      const memberStore = useMemberStore();
      const { isLogin } = storeToRefs(memberStore);
      if (isLogin.value) next();
      else {
        memberStore
          .verifyTokenExpiration()
          .then(() => {
            next("/");
          })
          .catch(() => next());
      }
    },
  },

  {
    path: "/interview",
    component: () => import("layouts/HomePageLayout.vue"),
    children: [
      { path: "", component: () => import("pages/InterviewPage.vue") },
    ],
    props: true,
    beforeEnter: (to, from, next) => {
      const memberStore = useMemberStore();
      const { isLogin, verifyTokenExpiration } = storeToRefs(memberStore);
      if (
        isLogin.value &&
        (from.path === "/cv/list" || from.matched.length === 0)
      ) {
        memberStore
          .verifyTokenExpiration()
          .then(() => {
            next();
          })
          .catch(() =>
            next({ path: "/members/login", query: { redirect: "/cv/list" } }),
          );
      } else next("/");
    },
  },
  {
    path: "/interview/list",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/InterviewListPage.vue"),
      },
    ],

    beforeEnter: (to, from, next) => {
      const memberStore = useMemberStore();
      const { isLogin } = storeToRefs(memberStore);
      if (isLogin.value) next();
      else {
        memberStore
          .verifyTokenExpiration()
          .then(() => {
            next();
          })
          .catch(() =>
            next({ path: "/members/login", query: { redirect: to.fullPath } }),
          );
      }
    },
  },
  {
    path: "/cv",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      {
        path: "upload",
        component: () => import("pages/CvUpload.vue"),
      },
      {
        path: "list",
        component: () => import("pages/CvList.vue"),
      },
    ],

    beforeEnter: (to, from, next) => {
      const memberStore = useMemberStore();
      const { isLogin } = storeToRefs(memberStore);
      if (isLogin.value) next();
      else {
        memberStore
          .verifyTokenExpiration()
          .then(() => {
            next();
          })
          .catch(() =>
            next({ path: "/members/login", query: { redirect: to.fullPath } }),
          );
      }
    },
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
      const memberStore = useMemberStore();
      const { isLogin } = storeToRefs(memberStore);
      if (isLogin.value) next("/");
      else {
        memberStore
          .verifyTokenExpiration()
          .then(() => {
            next("/");
          })
          .catch(() => next());
      }
    },
  },
  {
    path: "/board",
    component: () => import("layouts/BasicLayout.vue"),
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
      const memberStore = useMemberStore();
      const { isLogin } = storeToRefs(memberStore);
      if (isLogin.value) next();
      else {
        memberStore
          .verifyTokenExpiration()
          .then(() => {
            next();
          })
          .catch(() =>
            next({ path: "/members/login", query: { redirect: to.fullPath } }),
          );
      }
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
