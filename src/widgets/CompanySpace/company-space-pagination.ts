/**
 * Элементы пагинации для экрана пространств (макет Figma: номера + «…» + крайние страницы).
 * currentPage и totalPages — с 1.
 */
export type CompanySpacePaginationItem =
  | { type: "page"; page: number }
  | { type: "ellipsis"; key: string };

export function getCompanySpacePaginationItems(
  currentPage: number,
  totalPages: number,
): CompanySpacePaginationItem[] {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages === 1) {
    return [{ type: "page", page: 1 }];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: "page" as const,
      page: i + 1,
    }));
  }

  const items: CompanySpacePaginationItem[] = [];
  const pushPage = (page: number) => {
    const last = items[items.length - 1];

    if (last?.type === "page" && last.page === page) {
      return;
    }
    items.push({ type: "page", page });
  };

  const pushEllipsis = (key: string) => {
    const last = items[items.length - 1];

    if (last?.type === "ellipsis") {
      return;
    }
    items.push({ type: "ellipsis", key });
  };

  pushPage(1);

  if (currentPage <= 2) {
    pushPage(2);
    pushEllipsis("e1");
    pushPage(totalPages - 1);
    pushPage(totalPages);

    return items;
  }

  if (currentPage >= totalPages - 1) {
    pushEllipsis("e2");
    pushPage(totalPages - 2);
    pushPage(totalPages - 1);
    pushPage(totalPages);

    return items;
  }

  if (currentPage === 3) {
    pushPage(2);
    pushPage(3);
    pushEllipsis("e3");
    pushPage(totalPages - 1);
    pushPage(totalPages);

    return items;
  }

  if (currentPage === totalPages - 2) {
    pushEllipsis("e4");
    pushPage(totalPages - 3);
    pushPage(totalPages - 2);
    pushPage(totalPages - 1);
    pushPage(totalPages);

    return items;
  }

  pushEllipsis("e5");
  pushPage(currentPage - 1);
  pushPage(currentPage);
  pushPage(currentPage + 1);
  pushEllipsis("e6");
  pushPage(totalPages - 1);
  pushPage(totalPages);

  return items;
}
