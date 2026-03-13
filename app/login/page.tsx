"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        className="rounded-xl bg-black px-4 py-2 text-white"
        onClick={() => signIn("custom-oauth", { callbackUrl: "/" })}
      >
        로그인
      </button>
    </main>
  );
}
