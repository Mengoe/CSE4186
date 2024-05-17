import { defineStore } from "pinia";
import { useMemberStore } from "./member";
import { getToken } from "src/utils/cookies.js";
import { api } from "boot/axios.js";

export const useBoardStore = defineStore("board", {
  state: () => ({
    post: {
      id: null,
      title: "",
      content: "",
      userId: null,
      like: null,
      dislike: null,
      viewCount: null,
      checkLikeOrDislike: false,
      comments: [
        {
          id: null,
          content: {
            verbal: [],
            nonverbal: [],
            review: "",
          },
          username: "",
          createdAt: "",
          userId: null,
          postId: null,
        },
      ],
    },
    postList: [],
    pageCount: 0,
    loading: false,
    prefs: { like: 0, dislike: 0 },
  }),
  getters: {},
  actions: {
    initPost() {
      this.post = {
        id: null,
        title: "",
        content: "",
        userId: null,
        like: null,
        dislike: null,
        viewCount: null,
        checkLikeOrDislike: false,
        comments: [
          {
            id: null,
            content: {
              verbal: [],
              nonverbal: [],
              review: "",
            },
            username: "",
            createdAt: "",
          },
        ],
      };
    },

    bearerToken() {
      return "Bearer " + getToken();
    },

    // fetch all posts
    async fetchPosts(params) {
      console.log(params);
      const { page, size, searchBy, q } = params;

      const getPostListAPI = searchBy
        ? `/post/list?page=${page}&size=${size}&q=${q}&searchBy=${searchBy}`
        : `/post/list?page=${page}&size=${size}`;

      const accessToken = this.bearerToken(getToken());
      this.loading = true;

      try {
        const res = await api.get(getPostListAPI, {
          headers: {
            Authorization: accessToken,
          },
        });
        if (res.data.result === "success") {
          this.postList = res.data.body.list;
          this.pageCount = res.data.body.pageCount;
        } else throw new Error("fetchPosts error");
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    // fetch post with id
    fetchPost(postId) {
      const accessToken = this.bearerToken();
      this.loading = true;
      this.prefs = { like: 0, dislike: 0 };

      api
        .get(`/post/${postId}`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          if (res.data.result === "success") {
            this.post = res.data.body;
            this.prefs.like = this.post.like;
            this.prefs.dislike = this.post.dislike;
            console.log(this.post);
          } else throw new Error(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          alert(err);
          this.router.push("/board");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    addPost(title, content) {
      const accessToken = this.bearerToken();
      const userId = useMemberStore().userId;

      const postObj = {
        title,
        content,
        userId,
      };

      console.log(postObj);
      this.loading = true;

      api
        .post("/post", JSON.stringify(postObj), {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    updatePost(postId, title, content) {
      const accessToken = this.bearerToken();

      const updateObj = {
        title,
        content,
      };

      this.loading = true;
      api
        .put(`/post/${postId}`, JSON.stringify(updateObj), {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    deletePost(postId) {
      const accessToken = this.bearerToken();

      api
        .delete(`/post/${postId}`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          console.log(res);
          alert("삭제되었습니다.");
          this.router.push("/board");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addComment(contentObj) {
      const postId = this.post.id;

      const accessToken = this.bearerToken();
      const userId = useMemberStore().userId;

      const commentObj = {
        content: JSON.stringify(contentObj),
        userId,
      };

      api
        .post(`/post/${postId}/comment`, JSON.stringify(commentObj), {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          console.log(res);
          alert("등록되었습니다.");
          this.router.go(0); // reload page to show added Comment
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteComment(postId, commentId) {
      const accessToken = this.bearerToken();

      const commentObj = {
        id: commentId,
      };

      api
        .delete(`/post/${postId}/comment`, {
          headers: {
            Authorization: accessToken,
          },
          data: commentObj,
        })
        .then((res) => {
          console.log(res);
          alert("삭제되었습니다."); // reload page
          this.router.go(0);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    updateComment(postId, commentId, contentObj) {
      const accessToken = this.bearerToken();

      const updateObj = {
        id: commentId,
        content: JSON.stringify(contentObj),
      };

      api
        .put(`/post/${postId}/comment`, JSON.stringify(updateObj), {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          console.log(res);
          alert("수정되었습니다.");
          this.router.go(0); // reload page to show added Comment
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    submitReport(reportObj) {
      const accessToken = this.bearerToken();

      api
        .post("/report", JSON.stringify(reportObj), {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          console.log(res);
          alert("신고되었습니다.");
          this.router.go(0);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async reflectLikeOrDislike(postId, preference) {
      const accessToken = this.bearerToken();
      const userId = useMemberStore().userId;

      try {
        const res = await api.post(
          `/post/${postId}/` + preference,
          JSON.stringify({ userId }),
          {
            headers: {
              Authorization: accessToken,
            },
          },
        );

        if (res.status === 200 && res.data.result === "success") {
          switch (res.data.body) {
            case "좋아요 성공":
              this.post.checkLikeOrDislike = "like";
              this.prefs["like"]++;
              break;
            case "좋아요 취소":
              this.post.checkLikeOrDislike = "none";
              this.prefs["like"]--;
              break;
            case "싫어요 성공":
              this.post.checkLikeOrDislike = "dislike";
              this.prefs["dislike"]++;
              break;
            case "싫어요 취소":
              this.post.checkLikeOrDislike = "none";
              this.prefs["dislike"]--;
              break;
            default:
              throw new Error("pref error");
          }
        }
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    },
  },
});
