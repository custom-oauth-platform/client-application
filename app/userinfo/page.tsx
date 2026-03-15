import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Mail, UserRound, Users, ArrowLeft } from "lucide-react";

type MyPageApiResponse = {
  userId: string;
  name: string;
  email: string | null;
  gender: string | null;
  birthdate: string | null;
};

const RESOURCE_SERVER_BASE_URL =
  process.env.RESOURCE_SERVER_BASE_URL ?? "http://localhost:8081";

async function fetchMyPage(accessToken: string): Promise<MyPageApiResponse | null> {
  try {
    const response = await fetch(`${RESOURCE_SERVER_BASE_URL}/api/userinfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as MyPageApiResponse;
  } catch {
    return null;
  }
}

export default async function MyPage() {
  const session = await auth();

  if (!session?.user || !session.accessToken) {
    redirect("/");
  }

  const profile = await fetchMyPage(session.accessToken);

  const name = profile?.name ?? "-";
  const email = profile?.email ?? "-";
  const birth = profile?.birthdate ?? "-";
  const gender = profile?.gender ?? "-";

  return (
    <main className="min-h-screen bg-[#F7F8F8] px-6 py-18">
      <div className="mx-auto max-w-[420px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#64748B] transition hover:text-[#334155]"
        >
          <ArrowLeft size={16} />
          Home
        </Link>

        <div className="mt-6 flex flex-col items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#D1E7D7] bg-[#EEF7F0] text-[32px] font-bold text-[#16A34A]">
            {name.charAt(0)}
          </div>

          <h1 className="mt-3 text-[26px] font-bold text-[#1F2937]">{name}</h1>

          <p className="mt-1 text-[14px] text-[#64748B]">{email}</p>
        </div>

        <section className="mt-6 rounded-2xl border border-[#D9E2EC] bg-white p-3 shadow-sm">
          <InfoCard
            icon={<UserRound className="h-5 w-5 text-[#16A34A]" />}
            label="이름"
            value={name}
          />

          <InfoCard
            icon={<Calendar className="h-5 w-5 text-[#16A34A]" />}
            label="생년월일"
            value={birth}
          />

          <InfoCard
            icon={<Users className="h-5 w-5 text-[#16A34A]" />}
            label="성별"
            value={gender}
          />

          <InfoCard
            icon={<Mail className="h-5 w-5 text-[#16A34A]" />}
            label="이메일"
            value={email}
            last
          />
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-4 ${
        last ? "" : "border-b border-[#E5EDF5]"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF7F0]">
        {icon}
      </div>

      <div className="flex flex-col">
        <span className="text-[13px] font-medium text-[#64748B]">{label}</span>

        <span className="text-[18px] font-semibold text-[#1F2937]">
          {value}
        </span>
      </div>
    </div>
  );
}
