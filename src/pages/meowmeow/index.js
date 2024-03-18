import Pagination from "@/components/reuseable/Pagination";
import Skeleton from "@/components/reuseable/Skeleton";
import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { FaTrashAlt } from "react-icons/fa";
import DeleteDialog from "./component/DeleteDialog";
import Snackbar from "@/components/reuseable/Snackbar";
import Button from "@/components/reuseable/Button";
import { CiCirclePlus } from "react-icons/ci";
import AttendanceDialog from "../home/component/AttendanceDialog";
import { TbEdit } from "react-icons/tb";
import EditDialog from "./component/EditDialog";
import { useQuery } from "react-query";
import { getAttendence, logout } from "../../api-call/meowmeow";
import { useRouter } from "next/router";

export default function MeowMeow() {
  const [openDeletedialog, setOpenDeletedialog] = useState(false);
  const [openAttendaceDialog, setOpenAttendaceDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState({});
  const [editDialogData, setEditDialogData] = useState({});

  //open dialog
  const OpenEditDialog = (data) => {
    setOpenEditDialog(true);
    setEditDialogData(data);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false); // Close the dialog
    setEditDialogData({});
  };

  // state for snackbar
  const [show, setShow] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const OpenDeleteDialog = (id, name) => {
    setOpenDeletedialog(true);
    setDeleteDialogData({
      id,
      name,
    });
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeletedialog(false); // Close the dialog
    setDeleteDialogData({});
  };

  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState();
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState();

  //search function
  const handleSearch = (e) => {
    const words = e.target.value;

    // Clear the previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout to trigger the search after 2000 milliseconds (2 seconds)
    const newSearchTimeout = setTimeout(() => {
      if (words !== "") {
        setSearch(`&search=${words}`);
      } else {
        setSearch("");
      }
    }, 2000);

    // Update the searchTimeout state
    setSearchTimeout(newSearchTimeout);
  };

  //pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerCurrentPage, setRowsPerCurrentPage] = useState(10);

  const cookies = new Cookies();
  const router = useRouter();
  const signOut = async () => {
    const response = await axios.get(`/auth/logout`);
    console.log(response.status);
    if (response.message === "successful logout") {
      cookies.remove("basyToken");
      router.push("/login");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAttendence", currentPage, rowsPerCurrentPage, search],
    queryFn: () => getAttendence(currentPage, rowsPerCurrentPage, search),
  });
  const attendanceData = data?.data;
  const pagination = data?.pagination;
  return (
    <div className="flex justify-center items-center bg-[#faf7f2] ">
      <div className="w-full ">
        <div className="relative w-full h-screen pt-20 bg-[#faf7f2]">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <div className="flex gap-4 items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Guestlist
                  </h1>
                  <Button
                    width=""
                    onClick={signOut}
                    variant="outlined"
                    styles=" flex justify-center items-center"
                  >
                    Logout
                  </Button>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all the guest that answered to the form.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center bg-white rounded border border-gray-300 px-3 py-2 w-[450px]">
                <BsSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name"
                  className="ml-2 px-2 py-0.5 text-body1 text-textPrimary rounded border-none outline-none w-full shadow-none active:border-none"
                  onChange={(e) => handleSearch(e)}
                />
              </div>
              <div>
                <Button
                  variant="contained"
                  onClick={() => setOpenAttendaceDialog(true)}
                >
                  <div className="flex gap-2">
                    <CiCirclePlus size={24} />
                    <div>Add attendee</div>
                  </div>
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-[#cca878]">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                          >
                            Phone number
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                          >
                            Attendance
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      {isLoading && (
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              <Skeleton />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <Skeleton />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <Skeleton />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <Skeleton />
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              {/* <a
                                href="#"
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                                <span className="sr-only">, {item.name}</span>
                              </a> */}
                            </td>
                          </tr>
                        </tbody>
                      )}
                      {attendanceData?.length < 1 && !isLoading && (
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr>
                            <td
                              colSpan={5}
                              className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                            >
                              <div className="py-16 w-full flex items-center justify-center">
                                <div>Guest not available</div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      )}
                      {attendanceData?.length > 0 && !isLoading && (
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {attendanceData?.map((item, index) => (
                            <tr key={index}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {item.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.email}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.phoneNumber}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {item.attendance ? "Yes" : "No"}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex gap-4 items-center">
                                  <TbEdit
                                    size={18}
                                    className=" text-gray-500 cursor-pointer hover:text-gray-900"
                                    onClick={() => OpenEditDialog(item)}
                                  />
                                  <FaTrashAlt
                                    onClick={() =>
                                      OpenDeleteDialog(item._id, item.name)
                                    }
                                    size={18}
                                    className="text-red-500 hover:text-red-700"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                    {attendanceData?.length > 0 && !isLoading && (
                      <Pagination
                        count={pagination?.totalDocuments}
                        lastPage={pagination?.totalPages}
                        from={pagination?.from}
                        to={pagination?.to}
                        pages={currentPage}
                        rows={rowsPerCurrentPage}
                        setPages={setCurrentPage}
                        setRows={setRowsPerCurrentPage}
                      />
                    )}
                    <DeleteDialog
                      open={openDeletedialog}
                      handleClose={handleCloseDeleteDialog}
                      data={deleteDialogData}
                      setSnackbarOpen={() => setShow(true)}
                      setFailed={setIsFailed}
                    />
                    <AttendanceDialog
                      open={openAttendaceDialog}
                      setOpen={setOpenAttendaceDialog}
                      setSnackbarOpen={() => setShow(true)}
                      setFailed={setIsFailed}
                    />
                    <EditDialog
                      open={openEditDialog}
                      handleClose={handleCloseEditDialog}
                      setSnackbarOpen={() => setShow(true)}
                      setFailed={setIsFailed}
                      data={editDialogData}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        failed={isFailed}
        show={show}
        close={() => setShow(false)}
        message={isFailed ? "An error just occured" : "Delete successful"}
      />
    </div>
  );
}
