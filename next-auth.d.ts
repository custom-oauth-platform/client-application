import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    /**
     * session.user 객체에 커스텀 필드를 추가합니다.
     */
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            gender?: string;
            birthdate?: string;
        } & DefaultSession["user"];
    }

    /**
     * profile() 콜백에서 반환되는 유저 객체 타입 정의
     */
    interface User {
        gender?: string;
        birthdate?: string;
    }
}

declare module "next-auth/jwt" {
    /**
     * JWT 토큰 객체에 데이터를 저장하기 위한 타입 정의
     */
    interface JWT {
        accessToken?: string;
        gender?: string;
        birthdate?: string;
    }
}