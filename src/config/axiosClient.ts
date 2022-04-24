import axios from "axios";
import Cookie from "js-cookie";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "https://e-library-of-lms-be.herokuapp.com/",
  /*baseURL: "http://localhost:3000",*/
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  (config) => {
    //Handle token here ...
    if (config.headers) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.accessToken) {
        config.headers.authorization = `Bearer ${user.accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    console.error(error);
  }
);
axiosClient.interceptors.response.use(
  (res) => {
    console.log(`log at: => clientAxios.js => before response => res:`, res);
    if (res && res.data) return res.data;
    return res;
  },
  (error) => {
    if (error.response) {
      console.log(
        `log at: => clientAxios.js => error response => res.data:`,
        error.response.data
      );

      return error.response.data;
    }
  }
);

export default axiosClient;