import axios, { getData } from "@/lib/axios";

export const getAttendence = async (
  currentPage,
  rowsPerCurrentPage,
  search
) => {
  const response = await axios.get(
    `/getAttendance?page=${currentPage}&rowsPerPage=${rowsPerCurrentPage}${search}`
  );
  return getData(response);
};
export const logout = async () => {
  const response = await axios.get(`/auth/logout`);
  return getData(response);
};
