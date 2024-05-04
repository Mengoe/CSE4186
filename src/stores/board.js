import { defineStore } from "pinia";
import { Cookies } from "quasar";
import { useMemberStore } from "./member";
import axios from "axios";

export const useBoardStore = defineStore("board", {
  state: () => ({
    post: {
      id: null,
      title: "",
      content: "",
      userId: null,
      comments: [
        {
          id: null,
          content: "",
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
        comments: [
          {
            id: null,
            content: "",
            username: "",
            createdAt: "",
          },
        ],
      };
    },

    // return access Token
    getToken() {
      const accessToken = Cookies.get("access_token");
      return accessToken;
    },

    // fetch all posts
    fetchPosts(params) {
      console.log(params);
      const { page, size, searchBy, q } = params;

      const getPostListAPI = searchBy
        ? `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/list?page=${page}&size=${size}&q=${q}&searchBy=${searchBy}`
        : `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/list?page=${page}&size=${size}`;

      console.log(getPostListAPI);
      const accessToken = this.getToken();
      this.loading = true;

      axios
        .get(getPostListAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log("fetchAllPost succeed");
          console.log(res.data);
          if (res.data.result === "success") {
            this.postList = res.data.body;
            this.pageCount = res.data.pageCount;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // fetch post with id
    fetchPost(postId) {
      const getPostAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/${postId}`;

      const accessToken = this.getToken();
      this.loading = true;

      axios
        .get(getPostAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.result === "success") this.post = res.data.body;
          else throw new Error(res.data.message);
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
      const addPostAPI =
        "http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post";

      const accessToken = this.getToken();
      const userId = useMemberStore().userId;
      console.log(accessToken);

      const postObj = {
        title,
        content,
        userId,
      };

      console.log(postObj);
      this.loading = true;

      axios
        .post(addPostAPI, JSON.stringify(postObj), {
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${accessToken}`,
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
      const updatePostAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/${postId}`;
      const accessToken = this.getToken();

      const updateObj = {
        title,
        content,
      };

      console.log(updateObj);

      this.loading = true;
      axios
        .put(updatePostAPI, JSON.stringify(updateObj), {
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${accessToken}`,
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
      const deletePostAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/${postId}`;
      const accessToken = this.getToken();

      axios
        .delete(deletePostAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          alert("삭제되었습니다.");
          this.router.push("./");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addComment(content) {
      const postId = this.post.id;

      const addCommentAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/${postId}/comment`;

      const accessToken = this.getToken();
      const userId = useMemberStore().userId;

      const commentObj = {
        content,
        userId,
      };

      axios
        .post(addCommentAPI, JSON.stringify(commentObj), {
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          this.router.go(0); // reload page to show added Comment
        })
        .catch((err) => {
          console.log(err);
        });
    },

    deleteComment(postId, commentId) {
      console.log(postId, commentId);
      const deleteCommentAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/${postId}/comment`;
      const accessToken = this.getToken();

      const commentObj = {
        id: commentId,
      };

      console.log(commentObj);

      axios
        .delete(deleteCommentAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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

    // 댓글 양식 확정되면 구현
    updateComment(postId, commentId, content) {
      const updateCommentAPI = `http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/${postId}/comment`;
      const accessToken = this.getToken();

      const updateObj = {
        id: commentId,
        content,
      };

      axios
        .put(updateCommentAPI, JSON.stringify(updateObj), {
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${accessToken}`,
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
  },
});
