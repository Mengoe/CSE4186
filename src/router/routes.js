const routes = [
  {
    path: "/",
    component: () => import("layouts/BasicLayout.vue"),
    children: [
      { path: "", component: () => import("pages/MainPage.vue") },
      { path: "cvUpload", component: () => import("pages/CvUpload.vue") },
      { path: "cvList", component: () => import("pages/CvList.vue") },
    ],
  },
  {
    path: "/members",
    component: () => import("layouts/MembersLayout.vue"),
    children: [
      { path: "login", component: () => import("pages/LoginPage.vue") },
      { path: "join", component: () => import("pages/SignUp.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
