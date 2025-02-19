import axios from "axios";

const registerUser = async (username, email, phone, gender, password) => {
  return await axios.post("http://localhost:2000/api/v1/register", {
    username,
    email,
    phone,
    gender,
    password,
  });
};

const loginUser = async (emailPhone, password) => {
  return await axios.post(
    "http://localhost:2000/api/v1/login",
    {
      emailPhone,
      password,
    },
    {
      withCredentials: true,
    }
  );
};

export { registerUser, loginUser };
