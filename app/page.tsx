import { auth, signIn } from "@/app/auth";
import Link from "next/link";
import { LogIn, LogOut, User } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F8F8] px-6">
      <div className="flex w-full max-w-xl flex-col items-center">
        <h1 className="text-[60px] font-extrabold tracking-tight text-[#16A34A]">
          Salady
        </h1>

        {session?.user ? (
          <div className="mt-5 flex flex-col items-center">
            <p className="text-[24px] font-semibold text-[#1F2937]">
              안녕하세요,{" "}
              <span className="pr-1 text-[#16A34A]">
                {session.user.name ?? "사용자"}
              </span>
              님
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link
                href="/mypage"
                className="flex items-center gap-2 rounded-full bg-[#16A34A] px-6 py-2 text-[16px] font-semibold text-white shadow-sm transition hover:bg-[#15803D]"
              >
                <User size={18} />
                MyPage
              </Link>

              <a
                href="/api/auth/federated-logout"
                className="flex items-center gap-2 text-[15px] font-medium text-gray-500 transition hover:text-gray-700"
              >
                <LogOut size={18} />
                Logout
              </a>
            </div>
          </div>
        ) : (
          <form
            className="mt-6"
            action={async () => {
              "use server";
              await signIn("custom-oauth");
            }}
          >
            <button className="flex cursor-pointer items-center gap-2 rounded-full border border-[#CBD5E1] bg-white px-6 py-2 text-[16px] font-semibold text-[#1F2937] shadow-sm transition hover:bg-[#F8FAFC]">
              <LogIn size={18} />
              OAuth Login
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
