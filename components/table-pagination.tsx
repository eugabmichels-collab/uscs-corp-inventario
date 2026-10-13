"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function useTablePagination<T>(items: T[]) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pages);
  return {
    items: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    page: currentPage,
    pages,
    total: items.length,
    pageSize,
    setPage,
  };
}

export function TablePagination({
  page,
  pages,
  total,
  pageSize,
  setPage,
}: {
  page: number;
  pages: number;
  total: number;
  pageSize: number;
  setPage: (page: number) => void;
}) {
  if (!total) return null;
  return (
    <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Exibindo {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}{" "}
        de {total} registros
      </p>
      {pages > 1 && (
        <nav
          aria-label="Paginação da tabela"
          className="flex items-center gap-3"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm" aria-live="polite">
            {page} de {pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
          >
            Próxima
          </Button>
        </nav>
      )}
    </div>
  );
}
