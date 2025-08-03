import axios from "axios";
// 상황따라 주소 다름
// const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;
const PROD_BACKEND = process.env.REACT_APP_PROD_BACKEND;
// const BACKEND_PROXY = process.env.REACT_APP_BACKEND_PROXY;
// console.log("proxy", BACKEND_PROXY);

const api = axios.create({
  baseURL: PROD_BACKEND,
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});
/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    console.log("=== REQUEST DEBUG ===");
    console.log("Base URL:", request.baseURL);
    console.log("Request URL:", request.url);
    console.log("Full URL:", request.baseURL + request.url);
    console.log("Method:", request.method);
    console.log("Headers:", request.headers);
    console.log("Token:", sessionStorage.getItem("token"));
    console.log("=====================");
    request.headers.authorization = `Bearer ${sessionStorage.getItem("token")}`;
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.log("=== RESPONSE ERROR DEBUG ===");
    console.log("Status:", error.response?.status);
    console.log("Status Text:", error.response?.statusText);
    console.log("URL:", error.config?.url);
    console.log("Method:", error.config?.method);
    console.log("Headers:", error.response?.headers);
    console.log("Data:", error.response?.data);
    console.log("===========================");
    error = error.response.data;
    console.log("RESPONSE ERROR", error);
    return Promise.reject(error);
  }
);

export default api;
