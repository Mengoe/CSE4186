import { Cookies } from "quasar";

const options = {
  expires: "3d",
  path: "/",
  sameSite: "Lax",
  httpOnly: false,
};

const setToken = (userToken) => {
  Cookies.set("access_token", userToken, options);
};
const setUserId = (userId) => {
  Cookies.set("user_id", userId, options);
};

const getToken = () => {
  return Cookies.has("access_token") ? Cookies.get("access_token") : null;
};
const getUserId = () => {
  return Cookies.has("user_id") ? Cookies.get("user_id") : null;
};

const removeToken = () => {
  if (Cookies.has("access_token")) {
    try {
      Cookies.remove("access_token", options);
      Cookies.remove("user_id", options);
    } catch (err) {
      console.log("토큰 제거 에러");
    }
  }
};

export { setToken, getToken, setUserId, getUserId, removeToken };
