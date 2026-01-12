import axios from "axios";

const API_URL = "/api/ai";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("loggedNoteAppUser"));
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

const chatWithAI = async (message, context) => {
  const response = await axios.post(
    `${API_URL}/chat`,
    { message, context },
    { headers: getAuthHeader() }
  );
  return response.data;
};

export default {
  chatWithAI,
};
