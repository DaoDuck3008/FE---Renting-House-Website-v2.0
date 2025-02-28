import axios from "axios";

const fetchAllPosts = async (queryParams) => {
  return await axios.get(
    `http://localhost:2000/api/v1/posts/read?${queryParams}`,
    {
      withCredentials: true,
    }
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

const fetchPostWithUserId = async (query) => {
  return await axios.get(
    `http://localhost:2000/api/v1/posts/read/byUserId?${query}`
  );
};

const deleteHouseAPI = async (houseId) => {
  return await axios.delete(
    `http://localhost:2000/api/v1/posts/delete/${houseId}`,
    {
      withCredentials: true,
    }
  );
};

const updatePost = async (editData) => {
  return await axios.post(
    `http://localhost:2000/api/v1/posts/update`,
    editData
  );
};

export {
  fetchAllPosts,
  uploadAPost,
  fetchDistricts,
  updatePost,
  fetchPostWithUserId,
  deleteHouseAPI,
};
