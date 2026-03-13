import { auth, signIn, signOut } from "@/app/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Salady</h1>

      {session?.user ? (
        <div className="space-y-3">
          <p>안녕하세요, {session.user.name}님</p>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="rounded bg-black px-4 py-2 text-white">
              로그아웃
            </button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("custom-oauth");
          }}
        >
          <button className="rounded bg-black px-4 py-2 text-white">
            로그인
          </button>
        </form>
      )}
    </main>
  );
}
