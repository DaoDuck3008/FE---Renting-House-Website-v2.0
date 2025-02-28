import axios from "axios";

const deleteAComment = async (house_id) => {
  return await axios.delete(
    `http://localhost:2000/api/v1/comment/house/${house_id}`,
    {
      withCredentials: true,
    }
  );
};

export { deleteAComment };
