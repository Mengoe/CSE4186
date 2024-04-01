import { defineStore } from "pinia";
import { Cookies } from "quasar";

export const useMemberStore = defineStore("member", () => {
  const options = {
    expires: 1,
    path: "/",
    sameSite: "Strict",
    httpOnly: true,
  };
  const login = (loginObj) => {
    axios
      .post("/api/authenticate", loginObj)
      .then((res) => {
        Cookies.set("access_token", res, options);
        return true;
      })
      .catch((err) => {
        console.log(error);
        return false;
      });
  };
  const logout = () => {
    if (Cookies.has("access_token")) {
      try {
        Cookies.remove("acces_token", options);
      } catch (err) {
        console.log("로그아웃 에러");
      }
    }
  };
  const verifyToken = () => {};
  return { login, logout, verifyToken };
});
