'use server';
import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';

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

    // Redirect to login page without precompiling the form
    revalidatePath('/dashboard');
    redirect('/dashboard');  // Just redirect to the login page
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