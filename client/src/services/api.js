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

export { login, dashboardsAccess, logout, refreshToken };
