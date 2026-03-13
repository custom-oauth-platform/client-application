import { auth, signOut } from "@/app/auth";
import { NextResponse } from "next/server";

const CLIENT_HOME_URL = "http://localhost:3000";
const END_SESSION_ENDPOINT = "http://localhost:9000/connect/logout";

export async function GET() {
  const session = await auth();
  const endSessionUrl = new URL(END_SESSION_ENDPOINT);

  endSessionUrl.searchParams.set("post_logout_redirect_uri", CLIENT_HOME_URL);

  if (session?.idToken) {
    endSessionUrl.searchParams.set("id_token_hint", session.idToken);
  }

  await signOut({ redirect: false });

  return NextResponse.redirect(endSessionUrl);
}
