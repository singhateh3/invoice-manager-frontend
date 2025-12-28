const Pagination = ({
  totalPosts,
  postPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalPosts / postPerPage);
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center gap-2 mt-5">
      {/* First */}
      <button
        className="disabled:opacity-40 rounded px-3 py-1 bg-gray-200"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
      >
        First
      </button>

      {/* Prev */}
      <button
        className="disabled:opacity-40 rounded px-3 py-1 bg-gray-200"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Pages */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        className="disabled:opacity-40 rounded px-3 py-1 bg-gray-200"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      {/* Last */}
      <button
        className="disabled:opacity-40 rounded px-3 py-1 bg-gray-200"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
