import axios from "axios";
import add from "date-fns/add";
import Cookies from "universal-cookie";
const API_BASE_URL = "/api";
const cookies = new Cookies();
const request = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  async (config) => {
    const basyToken = cookies.get("basyToken");
    if (basyToken) {
      config.headers["Authorization"] = `Bearer ${basyToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    if (
      response.data.message === "successful login" ||
      response.data.message === "successful signup"
    ) {
      const now = new Date();
      const expires = add(now, { days: 30 });
      cookies.set("basyToken", response.data.data.token, {
        path: "/",
        expires,
      });
    }

    return response;
  },

  async (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.log("You dont have authorized to access this page");
        cookies.remove("basyToken", { path: "/" });
      } else if (status === 403) {
        console.log("You dont have permissions to perform this task");
      } else if (status === 500) {
        console.log("Server Error");
      }

      return Promise.reject(error.response);
    }
  }
);

export function getData(response) {
  return response.data;
}

export default request;
