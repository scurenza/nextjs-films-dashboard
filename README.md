# 🎬 Film Dashboard

Una web app realizzata con [Next.js](https://nextjs.org/) che permette di cercare film tramite l’API di The Movie DB, salvarli in due liste personalizzate ("Da Vedere" e "Visti") e gestire l'autenticazione tramite email/password.

Ecco il link: [App](https://filmdashboard.vercel.app/)

## 🚀 Funzionalità principali

- 🔎 **Ricerca film** usando [TheMovieDB API](https://www.themoviedb.org/documentation/api)
- ➕ Aggiungi film alla tua lista personale:
  - 📌 _Da Vedere_
  - ✅ _Visti_
- 📧 **Autenticazione** con email e password
- 🗃️ **Database PostgreSQL** ospitato su [Neon](https://neon.tech/)
- 📱 Interfaccia responsive con supporto per mobile

---

## 🛠️ Tech stack

- **Next.js** (app directory)
- **React**
- **Tailwind CSS**
- **PostgreSQL** via [Neon.tech](https://neon.tech)
- **NextAuth** per login via email
- **TheMovieDB API**

---

## 🔧 Setup locale

1. **Clona il repository:**

   ```bash
   git clone https://github.com/scurenza/nextjs-films-dashboard.git
   cd nextjs-film-dashboard
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**

   ```
   AUTH_SECRET=xxx
   AUTH_URL=xxx

   # Recommended for most uses
   DATABASE_URL=xxx

   # For uses requiring a connection without pgbouncer
   DATABASE_URL_UNPOOLED=xxx

   # Parameters for constructing your own connection string
   PGHOST=xxx
   PGHOST_UNPOOLED=xxx
   PGUSER=xxx
   PGDATABASE=xxx
   PGPASSWORD=xxx

   # Parameters for Vercel Postgres Templates
   POSTGRES_URL=xxx
   POSTGRES_URL_NON_POOLING=xxx
   POSTGRES_USER=xxx
   POSTGRES_HOST=xxx
   POSTGRES_PASSWORD=xxx
   POSTGRES_DATABASE=xxx
   POSTGRES_URL_NO_SSL=xxx
   POSTGRES_PRISMA_URL=xxx

   THEMOVIEDB_BEARER_TOKEN=xxx
   ```

4. **Avvia il progetto**

   ```bash
   npm run dev
   ```
