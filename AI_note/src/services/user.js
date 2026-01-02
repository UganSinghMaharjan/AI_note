import axios from "axios";
const API_URL = "http://localhost:5000/api/users";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
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

  const response = await axios.put(`${API_URL}/profile`, formData, config);
  return response.data;
};

export default { setToken, updateProfile };
