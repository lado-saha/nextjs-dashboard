import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

/**
 * We will manage al loptions related to the authentication of the users in our app like the passworkd endcruptuon method
 */
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig /**We destructure the object to store  */,
  providers: [
    Credentials({
      async authorize(credentials) {
        // We try to validation and match the passed credentials
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          // Compare the hashes
          const passwordMatch = await bcrypt.compare(password, user.password);

          // if the passwords matches we return the user
          if (passwordMatch) return user;
        }

        console.log('Invalid credentials.');
        return null;
      },
    }),
  ],
});
