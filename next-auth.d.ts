import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    accessToken?: string;
  }

  interface Account {
    id_token?: string;
    access_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    accessToken?: string;
    name?: string | null;
  }
}
