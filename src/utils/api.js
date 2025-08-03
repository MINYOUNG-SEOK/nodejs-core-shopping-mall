import axios from "axios";
// 상황따라 주소 다름
const LOCAL_BACKEND = process.env.REACT_APP_LOCAL_BACKEND;
const PROD_BACKEND = process.env.REACT_APP_PROD_BACKEND;

// 개발 환경이면 로컬, 프로덕션이면 배포 URL 사용
const BACKEND_URL =
  process.env.NODE_ENV === "development" ? LOCAL_BACKEND : PROD_BACKEND;

console.log("현재 환경:", process.env.NODE_ENV);
console.log("Backend URL:", BACKEND_URL);

const api = axios.create({
  baseURL: BACKEND_URL,
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
    request.headers.authorization = `Bearer ${sessionStorage.getItem("token")}`;
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    // 인증 실패 시 토큰 제거
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("token");
    }

    error = error.response.data;
    return Promise.reject(error);
  }
);

export default api;
