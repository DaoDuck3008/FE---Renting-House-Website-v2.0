import axios from "axios";

const fetchUserInfo = async () => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_API_URL}/get/user-info`,
    {
      withCredentials: true,
    }
  );
};

const deleteUserInfo = async () => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/logout`, {
    withCredentials: true,
  });
};

const updateUserInfo = async (userId, updateData) => {
  return await axios.patch(
    `${process.env.REACT_APP_BACKEND_API_URL}/update/user-info`,
    {
      userId,
      updateData,
    },
    {
      withCredentials: true,
    }
  );
};

export { fetchUserInfo, deleteUserInfo, updateUserInfo };
