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

    bearerToken(token) {
      return "Bearer " + token;
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
      const accessToken = this.bearerToken(getToken());
      this.loading = true;

      api
        .get(`/post/${postId}`, {
          headers: {
            Authorization: accessToken,
          },
        })
        .then((res) => {
          if (res.data.result === "success") {
            this.post = res.data.body;
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
      const accessToken = this.bearerToken(getToken());
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
      const accessToken = this.bearerToken(getToken());

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
      const accessToken = this.bearerToken(getToken());

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

      const accessToken = this.bearerToken(getToken());
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
      const accessToken = this.bearerToken(getToken());

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
      const accessToken = this.bearerToken(getToken());

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
      const accessToken = this.bearerToken(getToken());

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
  },
});
