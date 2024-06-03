import axios from "axios";
import { useMemberStore } from "stores/member.js";
import router from "src/router/index.js";
import route from "src/router/routes.js";
import { getToken, setToken } from "src/utils/cookies.js";

const memberStore = useMemberStore();

const tokenApi = axios.create({
  baseURL: "https://jobjourney.shop",
  headers: {
    "Content-Type": `application/json`,
  },
  withCredentials: true,
});

tokenApi.interceptors.request.use(
  function (config) {
    const accessToken = getToken();
    if (!accessToken) {
      router.push({
        path: "/members/login",
        query: { redirect: route.fullPath },
      });
      return Promise.reject(new Error("Access Token not found"));
    }
    config.headers["authorization"] = "Bearer " + accessToken;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

tokenApi.interceptors.response.use(
  (res) => {
    if (res.data.errorCode == 1001 || res.data.errCode == 1002) {
      memberStore.logout();
      router.push({
        path: "/members/login",
        query: { redirect: route.fullPath },
      });
      alert("토큰이 만료되어 로그아웃됩니다.");
    }
    if (res.headers.hasOwnProperty("authorization")) {
      let auth = res.headers.authorization.split(" ");
      if (auth[0] === "Bearer" && auth[1]) setToken(auth[1]);
    }
    return res;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default tokenApi;
