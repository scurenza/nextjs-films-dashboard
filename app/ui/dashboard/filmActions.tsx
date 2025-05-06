"use client";

import { usePathname } from "next/navigation";
import { DaVedere, Rimuovi, Visto } from "../invoices/buttons";
import { FilmPage } from "@/app/types/filmPage";
import { Film } from "@/app/types/film";

export function FilmActions({ film, userId }: { film: Film; userId: string }) {
  const pathname = usePathname();

  const isCerca = pathname.includes("cerca-un-film");
  const isDaVedere = pathname.includes("da-vedere");
  const isVisto = pathname.includes("visti");

  return (
    <div className="flex justify-evenly gap-3">
      {isCerca && (
        <>
          <Visto film={film} userId={userId} />
          <DaVedere film={film} userId={userId} />
        </>
      )}

      {isDaVedere && (
        <>
          <Visto film={film} userId={userId} page={FilmPage.DaVedere} />
          <Rimuovi film={film} userId={userId} page={FilmPage.DaVedere} />
        </>
      )}

      {isVisto && (
        <>
          <DaVedere film={film} userId={userId} page={FilmPage.Visto} />
          <Rimuovi film={film} userId={userId} page={FilmPage.Visto} />
        </>
      )}
    </div>
  );
}
