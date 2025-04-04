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
        const accessToken = credentials?.token;

        // 👉 JWT 검증 (선택)
        if (!accessToken) return null;

        try {
          const res = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (!res.ok) throw new Error('Failed to fetch user info');

          const userInfo = await res.json();

          // ✅ 세션에 저장될 사용자 정보
          return {
            id: userInfo.sub,
            name: userInfo.name,
            email: userInfo.email,
            image: userInfo.picture,
            accessToken,
          };
        } catch (err) {
          console.error('Token auth failed:', err);
          return null;
        }
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
