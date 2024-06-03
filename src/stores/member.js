import { defineStore } from "pinia";
import { Cookies } from "quasar";
import { ref } from "vue";
import { api } from "boot/axios.js";
import {
  setToken,
  removeToken,
  getToken,
  setUserId,
  getUserId,
} from "src/utils/cookies.js";
import { useRouter } from "vue-router";

export const useMemberStore = defineStore(
  "member",
  () => {
    const userId = ref(null);
    const loading = ref(false);
    const isLogin = ref(false);
    const router = useRouter();

    function duplicateCheck(params) {
      return new Promise((resolve, reject) => {
        api
          .post("/join/check", JSON.stringify(params), {
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

    const addLoginInfo = async (res) => {
      if (res.status == 200) {
        if (res.data.result === "success") {
          if (res.headers.hasOwnProperty("authorization")) {
            const token = res.headers["authorization"].split(" ")[1];
            setToken(token);
          }
          userId.value = res.data.body.userId;
          setUserId(userId.value);
          isLogin.value = true;
        } else if (res.data.result === "fail") {
          return Promise.reject("유효하지 않은 회원 정보입니다.");
        } else return Promise.reject("invalid resposne");
      } else return Promise.reject("invalid resposne");
    };

    const login = async (loginObj) => {
      const res = await api.post("/login", JSON.stringify(loginObj));
      await addLoginInfo(res);
    };

    const logout = async () => {
      removeToken();
      isLogin.value = false;
    };

    async function join(joinObj) {
      // second. send join request
      try {
        const joinResponse = await api.post("/join", JSON.stringify(joinObj), {
          headers: {
            "Content-Type": `application/json`,
          },
        });

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

    async function verifyTokenExpiration() {
      const userid = getUserId();
      if (!userid) throw new Error("no userid info");
      const accessToken = getToken();
      if (accessToken) {
        const res = await api.get("/token/check", {
          headers: {
            authorization: "Bearer " + accessToken,
          },
        });
        console.log(res);
        if (res.data.result === "success") {
          if (res.headers.hasOwnProperty("authorization")) {
            const auth = res.headers.authorization.split(" ");
            if (auth[0] === "Bearer" && auth[1]) {
              setToken(auth[1]);
              userId.value = userid;
              isLogin.value = true;
              return;
            }
          } else {
            userId.value = userid;
            isLogin.value = true;
            return;
          }
        }
        logout();
        throw new Error("failed validate token");
      }
    }

    return {
      addLoginInfo,
      login,
      logout,
      join,
      duplicateCheck,
      isLogin,
      verifyTokenExpiration,
      userId,
    };
  },
  {
    persist: { enabled: true },
  },
);
