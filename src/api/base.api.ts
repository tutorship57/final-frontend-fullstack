import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
});
//session check Interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // session หมด / ต้อง login ใหม่
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Data extraction Interceptor for easyly accessing data 
// api.interceptors.response.use(
//   (res) => res.data,        // เอา axios layer ออก
//   (err) => Promise.reject(err)
// );