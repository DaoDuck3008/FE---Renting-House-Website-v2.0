import axios from "axios";

const fetchAllPosts = async () => {
  return await axios.get("http://localhost:2000/api/v1/posts/read");
};

const uploadAPost = async (postData) => {
  return await axios.post(
    "http://localhost:2000/api/v1/posts/upload",
    postData
  );
};

export { fetchAllPosts, uploadAPost };
