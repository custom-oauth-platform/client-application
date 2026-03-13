import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    {
      id: "custom-oauth",
      name: "Custom OAuth",
      type: "oidc",

      issuer: "http://localhost:9000",

      authorization: {
        url: "http://localhost:9000/oauth2/authorize",
        params: {
          scope: "openid profile read write",
        },
      },

      token: "http://localhost:9000/oauth2/token",
      userinfo: "http://localhost:9000/userinfo",

      clientId: "oauth2-client-app",
      clientSecret: "secret",

      checks: ["pkce", "state"],

      profile(profile) {
        return {
          id: String(profile.sub),
          userId: profile.userId,
          name: profile.name,
          email: profile.email,
          gender: profile.gender,
          birthdate: profile.birthdate
        };
      },
    },
  ],
  callbacks: {
    // 1. 토큰이 생성/갱신될 때 실행: 계정 정보에서 access_token을 추출해 JWT에 저장
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // 2. 세션이 조회될 때 실행: JWT에 있는 access_token을 클라이언트/서버 컴포포넌트에서 쓸 수 있게 노출
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});
