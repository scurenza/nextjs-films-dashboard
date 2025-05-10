import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { getUserData } from "@/auth";
import { fetchFilteredFilms } from "@/app/lib/actions";
import {
  fetchFilteredFilmsDaVedere,
  fetchFilteredFilmsVisto,
} from "@/app/lib/data";
import { FilmActions } from "../dashboard/filmActions";
import { FilmPage } from "@/app/types/filmPage";
import { Film } from "@/app/types/film";

export default async function InvoicesTable({
  query,
  userId,
  currentPage,
  page,
}: {
  query?: string;
  userId?: string;
  currentPage: number;
  page: FilmPage;
}) {
  const user = await getUserData();
  const base_image_url = "https://image.tmdb.org/t/p/w92";
  const mobile_base_image_url = "https://image.tmdb.org/t/p/w45";

  let results: Film[] = [];

  if (page === FilmPage.CercaUnFilm && query) {
    const response = await fetchFilteredFilms(query, currentPage);
    const films = await response.json();

    results = Array.isArray(films?.results) ? films.results : [];
  } else if (page === FilmPage.DaVedere && userId) {
    results = (await fetchFilteredFilmsDaVedere(
      userId,
      currentPage
    )) as unknown as Film[];
  } else if (page === FilmPage.Visto && userId) {
    results = (await fetchFilteredFilmsVisto(
      userId,
      currentPage
    )) as unknown as Film[];
  }

  function formatDate(dateString?: string) {
    if (!dateString || typeof dateString !== "string")
      return "Data non disponibile";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "Data non valida";

    const formatted = new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);

    return formatted.replace(/\b[a-z]/, (char) => char.toUpperCase());
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {results.map((film) => (
              <div
                key={film.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="mb-2 w-1/4">
                    <Image
                      src={mobile_base_image_url + film.poster_path}
                      className=""
                      width={45}
                      height={45}
                      alt="Film poster"
                    />
                  </div>
                  <div className="w-3/4">
                    <p className="text-md text-black-300 ps-1">
                      {film.original_title}
                    </p>
                    <p className="text-sm text-gray-500 text-wrap">
                      {film.overview.length > 90
                        ? film.overview.slice(0, 90) + "..."
                        : film.overview}
                    </p>
                  </div>
                </div>
                <div className="flex min-w-[20px] w-full items-center justify-between pt-2">
                  <div>
                    <p className="text-sm font-medium pb-2">
                      {formatDate(film.release_date)}
                    </p>
                    <div className="">
                      {film.vote_average > 0 && (
                        <>
                          <Progress value={film.vote_average * 10} />
                          <p className="text-center mt-1">
                            {Number(film.vote_average).toFixed(2)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <div className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-evenly gap-3">
                        <FilmActions film={film} userId={user!.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {results.length === 0 ? (
            <div className="flex w-full items-center justify-center py-4">
              <p className="text-center text-2xl font-semibold text-gray-500">
                Aggiungi un film alla lista
              </p>
            </div>
          ) : (
            <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Copertina
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Titolo
                  </th>

                  <th scope="col" className="px-3 py-5 font-medium">
                    Data di Uscita
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Voto
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {results.map((film: Film) => (
                  <tr
                    key={film.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={base_image_url + film.poster_path}
                          className=""
                          width={92}
                          height={92}
                          alt={`${film.original_title}'s profile picture`}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {film.original_title}
                      <p className="text-sm text-gray-500 text-wrap">
                        {film.overview.length > 190
                          ? film.overview.slice(0, 190) + "..."
                          : film.overview}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDate(film.release_date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 lg:w-1/12">
                      {film.vote_average > 0 ? (
                        <>
                          <Progress
                            className="mt-8 mb-3"
                            value={film.vote_average * 10}
                          />
                          <p className="text-center">
                            {Number(film.vote_average).toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-center">N/A</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-evenly gap-3">
                        <FilmActions film={film} userId={user!.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
