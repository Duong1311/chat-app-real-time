import axios from "~/utils/authorizedAxios";

const login = (data) => {
  return axios.post("/v1/users/login", data);
};
const dashboardsAccess = () => {
  return axios.get("/v1/dashboards/access");
};
const logout = async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfor");

  return await axios.delete("/v1/users/logout");
};
const refreshToken = () => {
  return axios.put("/v1/users/refresh_token");
};
const searchUser = (search) => {
  return axios.get(`/v1/users/search?search=${search}`);
};
const fetchChat = (data) => {
  return axios.get(`/v1/chats?userId=${data}`);
};
const createChat = (data) => {
  return axios.post("/v1/chats", data);
};
const createGroupChat = (data) => {
  return axios.post("/v1/chats/group", data);
};
const fetchAllMessages = (id) => {
  return axios.get(`/v1/messages?chatId=${id}`);
};
const sendMessages = (data) => {
  return axios.post("/v1/messages", data);
};

export {
  login,
  dashboardsAccess,
  logout,
  refreshToken,
  searchUser,
  fetchChat,
  createChat,
  createGroupChat,
  fetchAllMessages,
  sendMessages,
};
