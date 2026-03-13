import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyPage() {
    // 1. NextAuth 세션 정보 가져오기 (accessToken 포함)
    const session = await auth();

    // 2. 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    if (!session) {
        redirect("/api/auth/signin");
    }

    // 3. 백엔드 Resource Server(Spring Boot)에 데이터 요청
    let backendData = null;
    let error = null;

    try {
        const response = await fetch("http://localhost:9000/userinfo", {
            method: "GET",
            headers: {
                // 백엔드가 인식할 수 있도록 Bearer 토큰 형식으로 전달
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            // 서버 컴포넌트이므로 캐싱 설정이 가능합니다 (필요시)
            cache: "no-store",
        });

        if (response.ok) {
            backendData = await response.json();
        } else {
            error = `백엔드 에러: ${response.status} ${response.statusText}`;
        }
    } catch (e) {
        error = "백엔드 서버에 연결할 수 없습니다.";
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
                마이페이지 (Authenticated)
            </h1>

            {/* 사용자 정보 섹션 */}
            <section style={{ backgroundColor: "#f3f4f6", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>내 프로필</h2>
                <p><strong>이름:</strong> {session.user?.name}</p>
                <p><strong>이메일:</strong> {session.user?.email}</p>
            </section>

            {/* 백엔드 API 데이터 섹션 */}
            <section style={{ border: "1px solid #e5e7eb", padding: "1rem", borderRadius: "8px" }}>
                <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem", color: "#2563eb" }}>
                    백엔드 API 응답 결과
                </h2>
                {error ? (
                    <p style={{ color: "#dc2626" }}>{error}</p>
                ) : (
                    <pre style={{ backgroundColor: "#1f2937", color: "#f9fafb", padding: "1rem", borderRadius: "4px", overflowX: "auto" }}>
            {JSON.stringify(backendData, null, 2)}
          </pre>
                )}
            </section>

            {/* 로그아웃 버튼 (간단한 구현) */}
            <div style={{ marginTop: "2rem" }}>
                <Link
                    href="/api/auth/signout"
                    style={{ backgroundColor: "#ef4444", color: "white", padding: "0.5rem 1rem", borderRadius: "4px", textDecoration: "none" }}
                >
                    로그아웃
                </Link>
            </div>
        </div>
    );
}