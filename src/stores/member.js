import { defineStore } from "pinia";
import { Cookies } from "quasar";
import { ref } from "vue";
import axios from "axios";
import { api } from "boot/axios.js";
import { setToken, removeToken } from "src/utils/cookies.js";

const options = {
  expires: "3d",
  path: "/",
  sameSite: "Lax",
};

export const useMemberStore = defineStore(
  "member",
  () => {
    const userId = ref(null);
    const loading = ref(false);
    const isLogin = ref(false);

    function duplicateCheck(params) {
      return new Promise((resolve, reject) => {
        const joinCheckAPI = "https://jobjourney.shop/join/check";

        axios
          .post(joinCheckAPI, JSON.stringify(params), {
            headers: {
              "Content-Type": `application/json`,
            },
          })
          .then((res) => {
            if (res.data.body == true) reject(res.data.result);
            else resolve(true);
          });
      });
    }

    const addLoginInfo = async (res, loginObj) => {
      if (res.status == 200) {
        if (res.data.result === "success") {
          const token = res.headers["authorization"].split(" ")[1];
          setToken(loginObj.email, token);
          userId.value = res.data.body.userId;
          isLogin.value = true;
          console.log(userId.value);
        } else if (res.data.result === "fail") {
          return Promise.reject("wrong info");
        } else return Promise.reject("invalid resposne");
      } else return Promise.reject("invalid resposne");
    };

    const login = async (loginObj) => {
      const res = await api.post("/login", JSON.stringify(loginObj));
      await addLoginInfo(res, loginObj);
    };

    async function logout() {
      removeToken();
      isLogin.value = false;
    }
    function autoLogin() {
      if (verifyTokenExpiration()) isLogin.value = true;
    }

    async function join(joinObj) {
      const joinAPI = "https://jobjourney.shop/join";

      // second. send join request
      try {
        const joinResponse = await axios.post(
          joinAPI,
          JSON.stringify(joinObj),
          {
            headers: {
              "Content-Type": `application/json`,
            },
          },
        );

        if (joinResponse.data.result == "fail")
          throw new Error(response.data.message);

        alert("회원가입을 축하드립니다! 로그인 화면으로 이동합니다.");
        this.router.push("/members/login");
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    }

    const verifyTokenExpiration = () => {
      const token = Cookies.has("access_token")
        ? Cookies.get("access_token").userToken
        : null;
      return token != null;
    };
    return {
      addLoginInfo,
      login,
      logout,
      join,
      duplicateCheck,
      isLogin,
      autoLogin,
      userId,
    };
  },
  {
    persist: true,
  },
);
