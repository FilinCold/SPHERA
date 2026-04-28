"use client";

import styles from "./Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

const PaginationChevron = ({ direction }: { direction: "left" | "right" }) => (
  <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden>
    <path
      d={direction === "left" ? "M11 3 6 8l5 5" : "M5 3l5 5-5 5"}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </svg>
);

const getPaginationItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | string)[] = [];

  items.push(1);

  if (currentPage <= 3) {
    items.push(2, 3, 4, "...", totalPages);
  } else if (currentPage >= totalPages - 2) {
    items.push("...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    items.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  return items;
};

export const Pagination = ({
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const paginationItems = getPaginationItems(currentPage, totalPages);

  const handlePrevPage = () => {
    if (hasPrevPage && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className={styles.pagination} aria-label="Пагинация">
      <button
        type="button"
        className={`${styles.paginationArrow} ${
          hasPrevPage && !isLoading ? styles.paginationArrowActive : styles.paginationArrowMuted
        }`}
        disabled={isLoading || !hasPrevPage}
        aria-label="Предыдущая страница"
        onClick={handlePrevPage}
      >
        <PaginationChevron direction="left" />
      </button>

      <div className={styles.paginationPages} role="group" aria-label="Номера страниц">
        {paginationItems.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className={styles.paginationEllipsis} aria-hidden>
                …
              </span>
            );
          }

          const page = item as number;

          return (
            <button
              key={page}
              type="button"
              className={
                page === currentPage
                  ? `${styles.paginationPage} ${styles.paginationPageCurrent}`
                  : styles.paginationPage
              }
              disabled={isLoading}
              aria-label={`Страница ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={`${styles.paginationArrow} ${
          hasNextPage && !isLoading ? styles.paginationArrowActive : styles.paginationArrowMuted
        }`}
        disabled={isLoading || !hasNextPage}
        aria-label="Следующая страница"
        onClick={handleNextPage}
      >
        <PaginationChevron direction="right" />
      </button>
    </nav>
  );
};
