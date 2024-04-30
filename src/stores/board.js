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
    fetchAllPosts() {
      const getPostListAPI =
        "http://ec2-3-39-165-26.ap-northeast-2.compute.amazonaws.com:8080/post/list";
      const accessToken = this.getToken();
      this.loading = true;

      axios
        .get(getPostListAPI, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          console.log("fetchAllPost succeed");
          if (res.data.result === "success") this.postList = res.data.body;
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
        })
        .catch((err) => {
          console.log(err);
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
          this.router.go(-1);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    addComment(content, postId) {
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
          this.router.go(0); // reload page
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
