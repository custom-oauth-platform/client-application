import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        if (account.id_token) {
          token.idToken = account.id_token;
        }

        if (account.access_token) {
          token.accessToken = account.access_token;
        }
      }

      if (profile?.name) {
        token.name = profile.name;
      }

      return token;
    },

    async session({ session, token }) {
      session.idToken = token.idToken as string | undefined;
      session.accessToken = token.accessToken as string | undefined;
      if (session.user) {
        session.user.name = (token.name as string | undefined) ?? session.user.name;
      }
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
          scope: "openid name gender birthdate email",
        },
      },

      clientId: "oauth2-client-app",
      clientSecret: "secret",
      checks: ["pkce", "state"],

      profile(profile) {
        return {
          id: String(profile.sub),
          name: profile.name ?? "User",
          email: profile.email ?? null,
        };
      },
    },
  ],
});
