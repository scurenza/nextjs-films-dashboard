import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/ui/invoices/table";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";

import { getUserData } from "@/auth";
import { fetchFilteredFilmsVisto, fetchTotalFilmsVisto } from "@/app/lib/data";
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

  const user = await getUserData();

  const totalCount = await fetchTotalFilmsVisto(user!.id);
  const totalPagesFilms = Math.ceil(totalCount / 20);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Film visti</h1>
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        {totalPagesFilms > 0 ? (
          <Table
            currentPage={currentPage}
            page={FilmPage.Visto}
            userId={user?.id}
          />
        ) : (
          <div>
            <p className="text-center mt-4 text-2xl font-semibold text-gray-500">
              Aggiungi un film alla lista
            </p>
          </div>
        )}
      </Suspense>
      {totalCount > 20 && (
        <div className="mt-5 flex w-full justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPagesFilms} />
        </div>
      )}
    </div>
  );
}
