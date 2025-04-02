import { parseJwt } from '@/utils/parseJwt';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Custom JWT',
      credentials: {
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        const token = credentials?.token;

        // 👉 JWT 검증 (선택)
        if (!token) return null;

        // 예: JWT에서 사용자 정보 추출
        const decoded = parseJwt(token); // decode only (또는 jwt.verify 등)
        return {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          accessToken: token,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
