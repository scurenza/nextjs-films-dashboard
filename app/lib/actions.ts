'use server';
import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { Film } from '../types/film';
import { FilmPage } from '../types/filmPage';

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export type RegisterState = {
    errors?: {
        email?: string[];
        password?: string[];
        name?: string[];
    };
    message?: string | null;
};


const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'require'
});

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Customer ID is required',
    }),
    amount: z.coerce.number().gt(0, {
        message: 'Amount must be greater than 0',
    }),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Status is required' }),
    date: z.string(),
});

const RegisterUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
});


const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please fill in all required fields',
        }
    }

    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
    } catch (error) {
        console.error(error);
    }


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function addFilmToDaVedere(film: Film, userId: string) {
    const tmdbId = film.themoviedb_id || film.id;
    const response = await fetchImdbId(film.id);
    const imdb = await response.json();

    const existing = await sql`
      SELECT 1 FROM da_vedere
      WHERE themoviedb_id = ${tmdbId} AND user_id = ${userId}
      LIMIT 1
    `;

    if (existing.length > 0) {
        return {
            status: "exists",
            message: "Il film è già nella tua lista.",
        };
    }

    try {
        await sql`
        INSERT INTO da_vedere (
          themoviedb_id, imdb_id, poster_path, original_title,
          overview, release_date, vote_average, user_id
        )
        VALUES (
          ${tmdbId}, ${imdb.imdb_id}, ${film.poster_path},
          ${film.original_title}, ${film.overview},
          ${film.release_date}, ${film.vote_average}, ${userId}
        )
      `;

        revalidatePath('/dashboard/cerca-un-film');

        return {
            status: "success",
            message: "Film aggiunto correttamente!",
        };
    } catch (error) {
        console.error("Errore durante l'inserimento:", error);
        return {
            status: "error",
            message: "Errore durante l'aggiunta del film.",
        };
    }
}

export async function addFilmToVisto(film: Film, userId: string) {
    const tmdbId = film.themoviedb_id || film.id;

    const response = await fetchImdbId(tmdbId);
    const imdb = await response.json();

    const existing = await sql`
      SELECT 1 FROM visto
      WHERE themoviedb_id = ${tmdbId} AND user_id = ${userId}
      LIMIT 1
    `;

    if (existing.length > 0) {
        return {
            status: "exists",
            message: "Il film è già nella tua lista.",
        };
    }

    try {
        await sql`
        INSERT INTO visto (
          themoviedb_id, imdb_id, poster_path, original_title,
          overview, release_date, vote_average, user_id
        )
        VALUES (
          ${tmdbId}, ${imdb.imdb_id}, ${film.poster_path},
          ${film.original_title}, ${film.overview},
          ${film.release_date}, ${film.vote_average}, ${userId}
        )
      `;

        revalidatePath('/dashboard/cerca-un-film');

        return {
            status: "success",
            message: "Film aggiunto correttamente!",
        };
    } catch (error) {
        console.error("Errore durante l'inserimento:", error);
        return {
            status: "error",
            message: "Errore durante l'aggiunta del film.",
        };
    }
}


export async function rimuoviFilm(film: Film, userId: string, page: FilmPage) {

    try {
        if (page === FilmPage.DaVedere) {
            await sql`DELETE FROM da_vedere WHERE id = ${film.id} AND user_id = ${userId}`;
        }
        if (page === FilmPage.Visto) {
            await sql`DELETE FROM visto WHERE id = ${film.id} AND user_id = ${userId}`;
        }
        revalidatePath('/dashboard/cerca-un-film');

        return {
            status: "success",
            message: "Film rimosso correttamente!",
        };
    } catch (error) {
        console.error("Errore durante la rimozione:", error);
        return {
            status: "error",
            message: "Errore durante la rimozione del film.",
        };
    }
}


export async function registerUser(prevState: RegisterState, formData: FormData) {
    const validatedFields = RegisterUserSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Please fill in all required fields',
        }
    }

    const { email, password, name } = validatedFields.data;

    try {
        const existingUser = await sql`
        SELECT * FROM users WHERE email = ${email}
        `

        if (existingUser.length) {
            return {
                errors: { email: ['Email already exists'] },
                message: 'Email already exists',
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sql`
        INSERT INTO users (name, email, password)
        VALUES (${name}, ${email}, ${hashedPassword})
        `

    } catch (error) {
        console.error(error);
        return {
            errors: { email: ['Error creating user'] },
            message: 'Error creating user',
        }
    }

    await authenticate(undefined, formData);


    revalidatePath('/dashboard');
    redirect('/dashboard');
}



export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;
    try {
        await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
    `
    } catch (error) {
        console.error(error);
    }


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}

export async function fetchFilteredFilms(query: string, currentPage: number) {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        }
    });

    const data = await res.json();
    return Response.json(data);
}

export async function fetchImdbId(movieDbId: number) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieDbId}/external_ids`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        }
    });

    const data = await res.json();
    return Response.json(data);
}

export async function fetchFilteredfilmsPages(query: string) {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        }
    });

    const data = await res.json();
    return Response.json(data);
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}