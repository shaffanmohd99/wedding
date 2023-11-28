import {
  BsChevronRight,
  BsChevronLeft,
  BsChevronBarRight,
  BsChevronBarLeft,
} from "react-icons/bs";

export default function Pagination({
  count,
  lastPage,
  pages,
  setPages,
  rows,
  setRows,
  from,
  to,
}) {
  // const [page, setPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (type) => {
    var currentPage = pages;
    if (type === "add" && pages < lastPage) {
      currentPage += 1;
    } else if (type === "minus" && pages > 1) {
      currentPage -= 1;
    }
    setPages(currentPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRows(parseInt(event.target.value, 10));
    setPages(1);
  };

  return (
    <div
    // className="px-4 sm:px-6 lg:px-8"
    >
      <div className="flex py-3.5 items-center justify-end gap-[30px] text-body1 text-gray-950 border-b border-t bg-white border-gray-200">
        <div className="flex gap-2 items-center ">
          <div className="text-body1 text-gray-950">Show</div>
          <select
            value={rows}
            onChange={handleChangeRowsPerPage}
            className="border w-[70px] border-gray-200 px-2 py-1 rounded focus:outline-none focus:border-gray-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="text-gray-950">{`${from}-${to} of ${count}`}</div>

        <div className="flex ">
          <button
            className="w-[35px] h-[35px] flex items-center justify-center disabled:text-gray-500"
            onClick={() => setPages(1)}
            disabled={pages === 1}
          >
            <BsChevronBarLeft size={20} />
          </button>
          <button
            className="w-[35px] h-[35px] flex items-center justify-center disabled:text-gray-500"
            onClick={() => handleChangePage("minus")}
            disabled={pages === 1}
          >
            <BsChevronLeft size={18} />
          </button>
          <button
            className="w-[35px] h-[35px] flex items-center justify-center disabled:text-gray-500"
            onClick={() => handleChangePage("add")}
            disabled={pages === lastPage}
          >
            <BsChevronRight size={18} />
          </button>
          <button
            className="w-[35px] h-[35px] flex items-center justify-center disabled:text-gray-500"
            onClick={() => setPages(lastPage)}
            disabled={pages === lastPage}
          >
            <BsChevronBarRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
