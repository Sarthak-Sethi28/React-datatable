import React from 'react';
import { PaginationConfig } from '../../types';

interface TablePaginationProps {
  pagination: PaginationConfig;
  total: number;
  onChange?: (page: number, pageSize: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  total,
  onChange,
}) => {
  const {
    page,
    pageSize,
    showSizeChanger = true,
    pageSizeOptions = [10, 20, 50, 100],
    showQuickJumper = false,
    showTotal,
  } = pagination;

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onChange?.(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const newPage = Math.ceil(((page - 1) * pageSize + 1) / newPageSize);
    onChange?.(newPage, newPageSize);
  };

  const handleQuickJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget;
      const newPage = parseInt(target.value, 10);
      if (!isNaN(newPage)) {
        handlePageChange(newPage);
        target.value = '';
      }
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            className={`datatable__pagination-btn ${i === page ? 'datatable__pagination-btn--active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show first page
      buttons.push(
        <button
          key={1}
          className={`datatable__pagination-btn ${1 === page ? 'datatable__pagination-btn--active' : ''}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );

      // Show ellipsis if needed
      if (page > 4) {
        buttons.push(
          <span key="start-ellipsis" className="datatable__pagination-ellipsis">
            ...
          </span>
        );
      }

      // Show pages around current page
      const start = Math.max(2, page - 2);
      const end = Math.min(totalPages - 1, page + 2);
      
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            className={`datatable__pagination-btn ${i === page ? 'datatable__pagination-btn--active' : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis if needed
      if (page < totalPages - 3) {
        buttons.push(
          <span key="end-ellipsis" className="datatable__pagination-ellipsis">
            ...
          </span>
        );
      }

      // Show last page
      if (totalPages > 1) {
        buttons.push(
          <button
            key={totalPages}
            className={`datatable__pagination-btn ${totalPages === page ? 'datatable__pagination-btn--active' : ''}`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  if (total === 0) {
    return null;
  }

  return (
    <div className="datatable__pagination">
      <div className="datatable__pagination-info">
        {showTotal ? (
          showTotal(total, [startIndex, endIndex])
        ) : (
          <span>
            Showing {startIndex} to {endIndex} of {total} entries
          </span>
        )}
      </div>

      <div className="datatable__pagination-controls">
        {showSizeChanger && (
          <div className="datatable__pagination-size">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="datatable__pagination-size-select"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="datatable__pagination-nav">
          <button
            className="datatable__pagination-btn datatable__pagination-btn--prev"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>

          {renderPaginationButtons()}

          <button
            className="datatable__pagination-btn datatable__pagination-btn--next"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>

        {showQuickJumper && (
          <div className="datatable__pagination-jumper">
            Go to
            <input
              type="number"
              min={1}
              max={totalPages}
              placeholder="Page"
              onKeyDown={handleQuickJump}
              className="datatable__pagination-jumper-input"
            />
          </div>
        )}
      </div>
    </div>
  );
}; 