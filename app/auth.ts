import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined;
      return session;
    },
  },
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
          name: profile.name ?? "User",
          email: profile.email ?? null,
          image: profile.picture ?? null,
        };
      },
    },
  ],
});
