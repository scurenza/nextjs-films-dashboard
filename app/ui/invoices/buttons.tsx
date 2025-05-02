"use client";
import { deleteInvoice } from "@/app/lib/actions";
import { Film } from "@/app/types/film";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

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

export function DaVedere({ film }: { film: Film }) {
  // return (
  //   <Link
  //     href={`/dashboard/invoices/${id}/edit`}
  //     className="rounded-md border p-2 hover:bg-gray-100"
  //   >
  //     <PencilIcon className="w-5" />
  //   </Link>
  // );
  return (
    <button
      className="flex flex-col items-center justify-center border-solid border-2 border-gray-200 rounded-md p-2 hover:bg-gray-100"
      onClick={() => console.log(film)}
    >
      <EyeIcon className="h-6 w-6 text-gray-500" />
      <p>Da Vedere</p>
    </button>
  );
}

export function Visto({ film }: { film: Film }) {
  console.log(film);

  // const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  // return (
  //   <form action={deleteInvoiceWithId}>
  //     <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
  //       <span className="sr-only">Delete</span>
  //       <TrashIcon className="w-5" />
  //     </button>
  //   </form>
  // );
  return (
    <button
      className="flex flex-col items-center justify-center border-solid border-2 border-gray-200 rounded-md p-2 hover:bg-gray-100"
      onClick={() => console.log(film)}
    >
      <EyeSlashIcon className="h-6 w-6 text-gray-500" />
      Visto
    </button>
  );
}
