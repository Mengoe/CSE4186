import axios from "axios";
import { api } from "boot/axios.js";
import { useMemberStore } from "stores/member.js";
import { useRouter } from "vue-router";
import { getToken, getRefreshToken, setToken } from "cookies.js";

const memberStore = useMemberStore();
const router = useRouter();
const refreshURI = "./reissue";

const tokenApi = axios.create({
  baseURL: "http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080",
  headers: {
    "Content-Type": `application/json`,
  },
  withCredentials: true,
  timeout: 1000,
});

tokenApi.interceptors.request.use(
  function (config) {
    const accessToken = getToken();
    if (!accessToken) {
      router.push("/members/login");
      return Promise.reject(new Error("Access Token not found"));
    }
    config.headers["authorization"] = "Bearer ${accessToken}";
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  },
);

tokenApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status == 401) {
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const res = await api.get(refreshURI, {
            headers: { Authorization: "Bearer ${refreshToken}" },
          });
          const accessToken = res.headers["authorization"].split(" ")[1];
          setToken(accessToken);
          error.config.headers["authorization"] = "Bearer ${accessToken}";
          return tokenApi(error.config);
        } else {
          return new Error("no refreshToken");
        }
      } catch (err) {
        router.push("/members/login");
        return Promise.reject(err);
      }
    } else return Promise.reject(error);
  },
);

export default tokenApi;
