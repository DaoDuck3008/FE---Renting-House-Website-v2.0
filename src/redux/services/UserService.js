import axios from "axios";

const fetchUserInfo = async () => {
  return await axios.get("http://localhost:2000/api/v1/get/user-info", {
    withCredentials: true,
  });
};

const deleteUserInfo = async () => {
  {
    return await axios.get("http://localhost:2000/api/v1/logout", {
      withCredentials: true,
    });
  }
};

const updateUserInfo = async (userId, updateData) => {
  return await axios.patch("http://localhost:2000/api/v1/update/user-info", {
    userId,
    updateData,
  });
};

const fetchPostWithUserId = async (userId) => {
  return await axios.get(
    `http://localhost:2000/api/v1/house/byUserId/${userId}`
  );
};

const updateHouseAPI = async (houseId, dataUpdate) => {
  return await axios.patch(
    `http://localhost:2000/api/v1/house/${houseId}`,
    dataUpdate,
    { withCredentials: true }
  );
};

const deleteHouseAPI = async (houseId) => {
  return await axios.delete(
    `http://localhost:2000/api/v1/house/${houseId}`,
    { withCredentials: true }
  );
};

export { fetchUserInfo, deleteUserInfo, updateUserInfo, fetchPostWithUserId,updateHouseAPI,deleteHouseAPI};
