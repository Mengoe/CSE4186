import { defineStore } from "pinia";
import { Cookies } from "quasar";
import axios from "axios";
import { ref } from "vue";

export const useMemberStore = defineStore(
  "member",
  () => {
    const isLogin = ref(false);
    const timer = ref(null);
    const options = {
      expires: "1d",
      path: "/",
      sameSite: "Strict",
      httpOnly: false,
    };
    function login(loginObj) {
      const loginApi =
        "http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/login";
      console.log(loginObj);

      axios
        .post(loginApi, JSON.stringify(loginObj), {
          headers: {
            "Content-Type": `application/json`,
          },
          withCredentials: true,
        })
        .then((res) => {
          if (res.status == 200 && res.data.result === "success") {
            const token = res.headers["authorization"].split(" ")[1];
            const user_token = {
              userEmail: loginObj.email,
              userToken: token,
            };
            console.log(user_token);
            Cookies.set("access_token", token, options);
            isLogin.value = true;
            return true;
          } else {
            console.log(res);
            return false;
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }

    function _login(loginObj) {
      if (loginObj.email == "asdf" && loginObj.password == "1234") {
        const user_token = {
          userEmail: loginObj.email,
          userToken: "token",
        };
        Cookies.set("access_token", user_token, options);
        isLogin.value = true;
        return true;
      } else return false;
    }

    function logout() {
      if (Cookies.has("access_token")) {
        try {
          Cookies.remove("access_token", options);
        } catch (err) {
          console.log("로그아웃 에러");
        }
      }
      isLogin.value = false;
    }
    function autoLogin() {
      const user_token = Cookies.has("access_token")
        ? Cookies.get("access_token")
        : null;
      if (user_token.userToken != null) {
        isLogin.value = true;
      }
    }
    function verifyToken() {
      const user_token = Cookies.has("access_token")
        ? Cookies.get("access_token")
        : null;
      if (user_token.userToken == null) {
        isLogin.value = false;
        return false;
      } else return true;
    }
    return { login, logout, isLogin, autoLogin };
  },
  {
    persist: true,
  },
);
