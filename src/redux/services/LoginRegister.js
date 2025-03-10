import axios from "axios";

const registerUser = async (username, email, phone, gender, password) => {
  return await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/register`, {
    username,
    email,
    phone,
    gender,
    password,
  });
};

const loginUser = async (emailPhone, password) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_API_URL}/login`,
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
