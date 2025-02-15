import axios from "axios";

const fetchAllPosts = async (queryParams) => {
  return await axios.get(
    `http://localhost:2000/api/v1/posts/read?${queryParams}`
  );
};

const fetchDistricts = async (city) => {
  return await axios.get(`http://localhost:2000/api/v1/districts/read`, {
    params: {
      city: city,
    },
  });
};

const uploadAPost = async (postData) => {
  return await axios.post(
    "http://localhost:2000/api/v1/posts/upload",
    postData
  );
};

const searchPost = async (queryParams) => {
  return await axios.get(
    `http://localhost:2000/api/v1/posts/read?${queryParams}`
  );
};

export { fetchAllPosts, uploadAPost, searchPost, fetchDistricts };
