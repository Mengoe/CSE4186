import { Cookies } from "quasar";

const options = {
  expires: "3d",
  path: "/",
  sameSite: "None",
  httpOnly: false,
};

const setToken = (userEmail, userToken) => {
  Cookies.set("access_token", userToken, options);
  Cookies.set("user_email", userEmail, options);
};

const getToken = () => {
  return Cookies.has("access_token") ? Cookies.get("access_token") : null;
};

const getRefreshToken = () => {
  return Cookies.has("refresh_token") ? Cookies.get("refresh_token") : null;
};

const removeToken = () => {
  if (Cookies.has("access_token")) {
    try {
      Cookies.remove("access_token", options);
      Cookies.remove("user_email", options);
      Cookies.remove("refresh_token", options);
    } catch (err) {
      console.log("토큰 제거 에러");
    }
  }
};

const setRefreshToken = (refreshToken) => {
  Cookies.set("refresh_token", refreshToken, options);
};

export { setToken, getToken, removeToken, getRefreshToken, setRefreshToken };
