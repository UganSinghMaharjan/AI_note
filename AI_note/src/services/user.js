import axios from "axios";

const USERS_URL = "/api/users";
const AUTH_URL = "/api/auth";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const login = async (credentials) => {
  const response = await axios.post(`${AUTH_URL}/login`, credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${AUTH_URL}/register`, userData);
  return response.data;
};

const updateProfile = async (file) => {
  const formData = new FormData();
  formData.append("picture", file);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  };

  const response = await axios.put(`${USERS_URL}/profile`, formData, config);
  return response.data;
};

export default { setToken, updateProfile, login, register };
