import axios from "axios";

const API_URL = "/api/notes";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const config = { headers: { Authorization: token } };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const create = async (newNote) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(API_URL, newNote, config);
  return response.data;
};

const update = async (id, updatedNote) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.patch(`${API_URL}/${id}`, updatedNote, config);
  return response.data;
};

const remove = async (id) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

const bulkRemove = async (count) => {
  const config = { headers: { Authorization: token } };
  const url = count ? `${API_URL}?count=${count}` : API_URL;
  const response = await axios.delete(url, config);
  return response.data;
};

const addAttachment = async (noteId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  };

  const response = await axios.post(
    `${API_URL}/${noteId}/attachments`,
    formData,
    config
  );
  return response.data;
};

const removeAttachment = async (noteId, attachmentId) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(
    `${API_URL}/${noteId}/attachments/${attachmentId}`,
    config
  );
  return response.data;
};

export default {
  getAll,
  create,
  update,
  remove,
  setToken,
  bulkRemove,
  addAttachment,
  removeAttachment,
};
