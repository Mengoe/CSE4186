import { defineStore } from "pinia";
import { useMemberStore } from "./member";
import tokenApi from "src/utils/interceptor.js";

export const useBoardStore = defineStore("board", {
  state: () => ({
    post: {
      id: null,
      title: "",
      content: "",
      jobField: "",
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
      videoList: [],
    },
    postList: [],
    videos: [],
    pageCount: 0,
    loading: false,
    prefs: { like: 0, dislike: 0 },
    jobFields: [],
    userName: "",
  }),
  getters: {},
  actions: {
    initPost() {
      this.post = null;
    },

    initLoading() {
      this.loading = false;
    },

    // fetch all posts
    async fetchPosts(params) {
      console.log(params);
      const { page, size, searchBy, q } = params;

      const getPostListAPI = searchBy
        ? `/post/list?page=${page}&size=${size}&q=${q}&searchBy=${searchBy}`
        : `/post/list?page=${page}&size=${size}`;

      this.loading = true;

      try {
        const res = await tokenApi.get(getPostListAPI);
        if (res.data.result === "success") {
          console.log(res.data);
          this.postList = res.data.body.list;
          this.pageCount = res.data.body.pageCount;
          console.log(this.postList);
        } else throw new Error("fetchPosts error");
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    },

    // fetch post with id
    fetchPost(postId) {
      this.loading = true;
      this.prefs = { like: 0, dislike: 0 };

      tokenApi
        .get(`/post/${postId}`)
        .then((res) => {
          if (res.data.result === "success") {
            this.post = res.data.body;
            this.prefs.like = this.post.like;
            this.prefs.dislike = this.post.dislike;
            localStorage.setItem("post", JSON.stringify(res.data.body));
          } else throw new Error(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          alert("삭제된 게시글입니다.");
          this.router.push("/board");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    addPost(title, content, videoId, jobFieldId) {
      console.log(videoId);
      const userId = useMemberStore().userId;
      const videoIdList = videoId !== null ? [videoId] : [];

      const postObj = {
        title,
        content,
        userId,
        jobFieldId,
        videoIdList,
      };

      console.log(postObj);
      this.loading = true;

      tokenApi
        .post("/post", JSON.stringify(postObj))
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

    updatePost(postId, title, content, videoId, jobFieldId) {
      const videoIdList = videoId !== null ? [videoId] : [];

      const updateObj = {
        title,
        content,
        jobFieldId,
        videoIdList,
      };

      console.log(updateObj);

      this.loading = true;
      tokenApi
        .put(`/post/${postId}`)
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
      tokenApi
        .delete(`/post/${postId}`)
        .then((res) => {
          console.log(res);
          alert("삭제되었습니다.");
          this.router.push("/board");
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async addComment(contentObj) {
      const postId = this.post.id;
      const userId = useMemberStore().userId;

      const commentObj = {
        content: JSON.stringify(contentObj),
        userId,
      };

      tokenApi
        .post(`/post/${postId}/comment`, JSON.stringify(commentObj))
        .then((res) => {
          console.log(res);
          this.post.comments.push(res.data.body);
          return Promise.resolve(true);
        })
        .catch((err) => {
          console.log(err);
          return Promise.reject("comment form error");
        });
    },

    deleteComment(postId, commentId) {
      const commentObj = {
        id: commentId,
      };

      tokenApi
        .delete(`/post/${postId}/comment`, {
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
      const updateObj = {
        id: commentId,
        content: JSON.stringify(contentObj),
      };

      tokenApi
        .put(`/post/${postId}/comment`, JSON.stringify(updateObj))
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
      tokenApi
        .post("/report", JSON.stringify(reportObj))
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
      const userId = useMemberStore().userId;

      try {
        const res = await tokenApi.post(
          `/post/${postId}/` + preference,
          JSON.stringify({ userId }),
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

    async fetchVideos(page, size) {
      this.videos = [];

      this.loading = true;

      const url = page
        ? `/video/list?page=${page}&size=${size}`
        : "/video/list";

      try {
        const res = await tokenApi.get(url);

        this.loading = false;

        if (res.status === 200 && res.data.result === "success") {
          console.log(res);
          this.videos = res.data.body.list;
          this.pageCount = res.data.body.pageCount;
          return Promise.resolve(true);
        } else return Promise.reject("fetch video err");
      } catch (err) {
        this.loading = false;
        console.log(err);
        return Promise.reject("fetch video err");
      }
    },

    fetchJobFields() {
      tokenApi
        .get("/field/list")
        .then((res) => {
          if (res.status === 200 && res.data.result === "success") {
            console.log(res.data);
            this.jobFields = res.data.body;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
});
