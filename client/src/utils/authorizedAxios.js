// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios from "axios";
import { toast } from "react-toastify";
import { logout, refreshToken } from "~/services/api";
import { API_ROOT } from "./constants";

let authorizedAxios = axios.create();
authorizedAxios.defaults.baseURL = API_ROOT;
authorizedAxios.defaults.timeout = 1000 * 60 * 10; // 10 minutes
authorizedAxios.defaults.withCredentials = true;

// Add a request interceptor
authorizedAxios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

let refreshTokenPromise = null;

// Add a response interceptor
authorizedAxios.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log(error);
    //410
    // nếu có lỗi 401 thì logout luôn
    if (error.response?.status === 401) {
      logout().then(() => {
        window.location.href = "/login";
      });
    }

    const originalRequest = error.config;
    // console.log(originalRequest);
    //nếu có lỗi 410 thì gọi api refresh token

    if (error.response?.status === 410 && originalRequest) {
      // originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken()
          .then((res) => {
            localStorage.setItem("accessToken", res.data.accessToken);
            authorizedAxios.defaults.headers.Authorization = `Bearer ${res.data.accessToken}`;
          })
          .catch((err) => {
            logout().then(() => {
              window.location.href = "/login";
            });
            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then(() => {
        //return bên dưới để gọi lại api đã bị lỗi
        return authorizedAxios(originalRequest);
      });
    }

    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);
export default authorizedAxios;
