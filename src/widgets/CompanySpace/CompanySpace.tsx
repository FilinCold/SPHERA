"use client";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import CompanyCard from "@/shared/components/CompanyCard/CompanyCard";
import TitleBar from "@/shared/components/TitleBar/TitleBar";
import { PAGES } from "@/shared/config/pages.config";
import { useStores } from "@/shared/store";

import { getCompanySpacePaginationItems } from "./company-space-pagination";
import styles from "./CompanySpace.module.scss";

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

const CompanySpaceComponent = () => {
  const { companyStore } = useStores();

  useEffect(() => {
    void companyStore.loadCompaniesList(0);
  }, [companyStore]);

  const {
    companiesList,
    companiesTotalCount,
    companiesPageDisplay,
    companiesTotalPages,
    hasPrevCompaniesPage,
    hasNextCompaniesPage,
    isCompaniesListLoading,
    companiesListError,
  } = companyStore;

  const paginationItems =
    companiesTotalPages > 1
      ? getCompanySpacePaginationItems(companiesPageDisplay, companiesTotalPages)
      : [];

  return (
    <main className={styles.page}>
      <TitleBar />

      <section className={styles.content}>
        {isCompaniesListLoading ? (
          <p className={styles.stateMessage}>Загрузка пространств…</p>
        ) : companiesListError ? (
          <p className={styles.errorMessage}>{companiesListError}</p>
        ) : companiesList.length === 0 ? (
          <p className={styles.stateMessage}>Пока нет ни одного пространства.</p>
        ) : (
          <>
            <div className={styles.cards}>
              {companiesList.map((company) => (
                <CompanyCard
                  key={company.id}
                  href={PAGES.EDIT_SPACE}
                  companySlug={company.id}
                  name={company.name}
                  subscriptionDate={company.subscriptionDate}
                  status={company.status}
                />
              ))}
            </div>

            {companiesTotalCount > 0 && companiesTotalPages > 1 ? (
              <nav className={styles.pagination} aria-label="Пагинация пространств">
                <button
                  type="button"
                  className={`${styles.paginationArrow} ${
                    !hasPrevCompaniesPage || isCompaniesListLoading
                      ? styles.paginationArrowMuted
                      : styles.paginationArrowActive
                  }`}
                  disabled={isCompaniesListLoading || !hasPrevCompaniesPage}
                  aria-label="Предыдущая страница"
                  onClick={() => void companyStore.goToPrevCompaniesPage()}
                >
                  <PaginationChevron direction="left" />
                </button>

                <div className={styles.paginationPages} role="group" aria-label="Номера страниц">
                  {paginationItems.map((item) =>
                    item.type === "ellipsis" ? (
                      <span key={item.key} className={styles.paginationEllipsis} aria-hidden>
                        …
                      </span>
                    ) : (
                      <button
                        key={item.page}
                        type="button"
                        className={
                          item.page === companiesPageDisplay
                            ? `${styles.paginationPage} ${styles.paginationPageCurrent}`
                            : styles.paginationPage
                        }
                        disabled={isCompaniesListLoading}
                        aria-label={`Страница ${item.page}`}
                        aria-current={item.page === companiesPageDisplay ? "page" : undefined}
                        onClick={() => void companyStore.goToCompaniesPageByIndex(item.page - 1)}
                      >
                        {item.page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  className={`${styles.paginationArrow} ${
                    !hasNextCompaniesPage || isCompaniesListLoading
                      ? styles.paginationArrowMuted
                      : styles.paginationArrowActive
                  }`}
                  disabled={isCompaniesListLoading || !hasNextCompaniesPage}
                  aria-label="Следующая страница"
                  onClick={() => void companyStore.goToNextCompaniesPage()}
                >
                  <PaginationChevron direction="right" />
                </button>
              </nav>
            ) : null}
          </>
        )}
      </section>

      <footer className={styles.footer}>Сделано в SFERA</footer>
    </main>
  );
};

export const CompanySpace = observer(CompanySpaceComponent);
