import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import "../style/common.style.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 12,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      <BootstrapPagination>
        <BootstrapPagination.Item
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          &lt;&lt;
        </BootstrapPagination.Item>

        <BootstrapPagination.Item
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </BootstrapPagination.Item>

        {pageNumbers.map((pageNum) => (
          <BootstrapPagination.Item
            key={pageNum}
            active={pageNum === currentPage}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </BootstrapPagination.Item>
        ))}

        <BootstrapPagination.Item
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </BootstrapPagination.Item>

        <BootstrapPagination.Item
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          &gt;&gt;
        </BootstrapPagination.Item>
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;
