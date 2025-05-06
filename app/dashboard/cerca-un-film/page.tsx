import Pagination from "@/app/ui/invoices/pagination";
import Search from "@/app/ui/search";
import Table from "@/app/ui/invoices/table";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchInvoicesPages } from "@/app/lib/data";
import { fetchFilteredfilmsPages } from "@/app/lib/actions";
import { FilmPage } from "@/app/types/filmPage";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const response = await fetchFilteredfilmsPages(query);
  const totalPagesFilms = await response.json();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Cerca un film</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Cerca il titolo di un film..." />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        {query && (
          <Table
            query={query}
            currentPage={currentPage}
            page={FilmPage.CercaUnFilm}
          />
        )}
      </Suspense>
      {query && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPagesFilms.total_pages} />
        </div>
      )}
    </div>
  );
}
