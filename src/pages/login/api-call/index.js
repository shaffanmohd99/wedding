import axios, { getData } from "@/lib/axios";

export const login = async (data) => {
  const response = await axios.post(`/auth/login`, data);
  //   const response = await axios.post(`/posts`, data);
  return getData(response);
};
