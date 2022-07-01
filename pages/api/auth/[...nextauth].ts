import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/signin',
  },
  // callbacks: {
  //   //? useSession() 훅을 호출할 때 호출되는 콜백 함수
  //   //? 기본으로 제공되는 정보를 커스터마이징할 수 있다.
  //   async session({ session, token, user }) {
  //     session.uid = token.sub; //? uid 추가
  //     return session;
  //   },
  // },
});
