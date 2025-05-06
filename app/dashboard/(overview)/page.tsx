import { lusitana } from "@/app/ui/fonts";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="flex justify-center items-center">
        <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-10 lg:p-20 rounded-lg text-white mt-32">
          <h2 className="capitalize text-center mb-2">Tutto molto semplice</h2>
          <ol className="list-decimal list-inside">
            <li>Cerca un film</li>
            <li>Mettilo tra i film &quot;Da Vedere&quot;</li>
            <li>Oppure tra i film &quot;Visti&quot;</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
