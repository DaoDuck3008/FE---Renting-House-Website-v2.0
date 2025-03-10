import axios from "axios";

const fetchAllPosts = async (queryParams) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API_URL}/posts/read?${queryParams}`,
    {
      withCredentials: true,
    }
  );
};

const fetchDistricts = async (city) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API_URL}/districts/read`,
    {
      params: {
        city: city,
      },
    }
  );
};

const uploadAPost = async (postData) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API_URL}/posts/upload`,
    postData
  );
};

const fetchPostWithUserId = async (query) => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API_URL}/posts/read/byUserId?${query}`
  );
};

const deleteHouseAPI = async (houseId) => {
  return await axios.delete(
    `${process.env.REACT_APP_BACKEND_API_URL}/posts/delete/${houseId}`,
    {
      withCredentials: true,
    }
  );
};

const updatePost = async (editData) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API_URL}/posts/update`,
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
