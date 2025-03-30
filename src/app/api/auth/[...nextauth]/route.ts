import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async redirect() {
      return '/tracker';
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
