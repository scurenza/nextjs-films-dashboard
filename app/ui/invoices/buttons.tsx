"use client";
import {
  addFilmToDaVedere,
  addFilmToVisto,
  rimuoviFilm,
} from "@/app/lib/actions";
import { Film } from "@/app/types/film";
import { FilmPage } from "@/app/types/filmPage";
import {
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { toast } from "sonner";

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DaVedere({
  film,
  userId,
  page,
}: {
  film: Film;
  userId: string;
  page?: FilmPage;
}) {
  async function handleClick() {
    const result = await addFilmToDaVedere(film, userId);
    if (page && result.status === "success") rimuoviFilm(film, userId, page);

    toast(result.message, {
      duration: 3000,
      style: {
        backgroundColor:
          result.status === "success"
            ? "#d1fae5"
            : result.status === "exists"
            ? "#fef9c3"
            : "#fecaca",
      },
    });
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center border-solid border-2 border-gray-200 rounded-md p-2 hover:bg-gray-100"
    >
      <EyeIcon className="h-6 w-6 text-gray-500" />
      <p className="hidden md:block">Da Vedere</p>
    </button>
  );
}

export function Visto({
  film,
  userId,
  page,
}: {
  film: Film;
  userId: string;
  page?: FilmPage;
}) {
  async function handleClick() {
    const result = await addFilmToVisto(film, userId);

    if (page && result.status === "success") rimuoviFilm(film, userId, page);

    toast(result.message, {
      duration: 3000,
      style: {
        backgroundColor:
          result.status === "success"
            ? "#d1fae5"
            : result.status === "exists"
            ? "#fef9c3"
            : "#fecaca",
      },
    });
  }

  return (
    <button
      className="flex flex-col items-center justify-center border-solid border-2 border-gray-200 rounded-md p-2 hover:bg-gray-100"
      onClick={handleClick}
    >
      <EyeSlashIcon className="h-6 w-6 text-gray-500" />
      <p className="hidden md:block">Visto</p>
    </button>
  );
}

export function Rimuovi({
  film,
  userId,
  page,
}: {
  film: Film;
  userId: string;
  page: FilmPage;
}) {
  async function handleClick() {
    const result = await rimuoviFilm(film, userId, page);

    toast(result.message, {
      duration: 3000,
      style: {
        backgroundColor:
          result.status === "success"
            ? "#d1fae5"
            : result.status === "exists"
            ? "#fef9c3"
            : "#fecaca",
      },
    });
  }
  return (
    <button
      className="flex flex-col items-center justify-center border-solid border-2 border-gray-200 rounded-md p-2 hover:bg-gray-100"
      onClick={handleClick}
    >
      <TrashIcon className="h-6 w-6 text-gray-500" />
      <p className="hidden md:block">Rimuovi</p>
    </button>
  );
}
