import { defineStore } from "pinia";
import { Cookies } from "quasar";
import { ref } from "vue";
import axios from "axios";

export const useMemberStore = defineStore(
  "member",
  () => {
    const userId = ref(null);
    const isLogin = ref(false);
    const timer = ref(null);
    const options = {
      expires: "1d",
      path: "/",
      sameSite: "Strict",
      httpOnly: false,
    };

    function login(loginObj) {
      return new Promise((resolve, reject) => {
        const loginApi =
          "http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/login";

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
              userId.value = res.data.body.userId;
              console.log(userId.value);
              resolve(true);
            } else {
              reject("fail to login");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }

    function _login(loginObj) {
      if (loginObj.email == "asdf@gmail.com" && loginObj.password == "1234") {
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
      if (verifyTokenExpiration) isLogin.value = true;
      if (verifyTokenExpiration) {
        isLogin.value = true;
      }
    }

    const verifyTokenExpiration = () => {
      const token = Cookies.has("access_token")
        ? Cookies.get("access_token").userToken
        : null;
      return token != null;
      /*
      if (token != null) {
        let base64Payload = state.accessToken.split(".")[1];
        base64Payload = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
        base64Payload = atob(base64Payload);
        const payloadObject = JSON.parse(base64Payload);
        const currentDate = new Date().getTime() / 1000;
        if (payloadObject.exp <= currentDate) {
          return false;
        } else {
          return true;
        }
      } else return false;
      */
    };
    return { login, logout, isLogin, autoLogin, userId };
  },
  {
    persist: true,
  },
);
