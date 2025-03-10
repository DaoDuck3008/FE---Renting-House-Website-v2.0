import axios from "axios";

const deleteAComment = async (house_id) => {
  return await axios.delete(
    `${process.env.REACT_APP_BACKEND_API_URL}/comment/house/${house_id}`,
    {
      withCredentials: true,
    }
  );
};

export { deleteAComment };
