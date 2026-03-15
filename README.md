# Client Application

Spring Authorization Server와 연동되는 **OAuth 2.0 / OpenID Connect(OIDC) 기반 클라이언트 애플리케이션**입니다.  
`Next.js App Router`와 `Auth.js`를 사용해 로그인 흐름을 구성하고, 발급받은 `access token`으로 리소스 서버의 보호된 API를 호출합니다.

<br />

## 1. 개요

OAuth 클라이언트 역할을 수행하는 프론트엔드 애플리케이션입니다.

- 사용자를 인가 서버 로그인 페이지로 리다이렉트
- Authorization Code Flow 기반 로그인 처리
- Auth.js를 통해 `access_token`, `id_token` 세션 저장
- 로그인된 사용자의 마이페이지 조회
- 리소스 서버 보호 API 호출
- 인가 서버와 연동된 로그아웃 처리

<br />

## 2. 기술 스택

- **Next.js** (App Router)
- **TypeScript**
- **Auth.js**
- **Tailwind CSS**
- **OAuth 2.0 / OpenID Connect**
- **Authorization Code Flow + PKCE**

<br />

## 3. 주요 기능

### 3.1 OAuth 로그인
홈 화면에서 로그인 버튼을 클릭하면 Auth.js가 인가 서버의 authorization endpoint로 사용자를 리다이렉트합니다.

- 로그인 시작 endpoint: `/api/auth/signin`
- 인가 서버 authorization endpoint: `http://localhost:9000/oauth2/authorize`

### 3.2 토큰 세션 저장
로그인 성공 후 Auth.js가 authorization code를 token endpoint로 교환한 뒤:

- `access_token`
- `id_token`

을 세션에 저장합니다.

### 3.3 마이페이지 조회
로그인 후 `/mypage` 페이지에서 서버 사이드로 세션을 읽고, `access_token`을 Authorization 헤더에 담아 리소스 서버의 `/api/mypage`를 호출합니다.

### 3.4 연합 로그아웃(Federated Logout)
로컬 세션만 종료하는 것이 아니라, 인가 서버의 로그아웃 endpoint까지 호출하여 인증 세션을 함께 종료합니다.

<br />

## 4. 프로젝트 구조

```bash
app
├── api
│   └── auth
│       ├── [...nextauth]
│       │   └── route.ts
│       └── federated-logout
│           └── route.ts
├── mypage
│   └── page.tsx
├── auth.ts
├── globals.css
├── layout.tsx
└── page.tsx
```

<br />

## 5. 환경 변수

프로젝트 실행을 위해 `.env.local` 파일에 다음 환경 변수를 설정해야 합니다.

```env
AUTH_SECRET=your-auth-secret
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
```

<br />

## 6. 실행 방법

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행


```bash
pnpm dev
```

### 3. 애플리케이션 접속

```
http://localhost:3000
```

<br />

## 7. 전제 조건

이 클라이언트 애플리케이션이 정상적으로 동작하려면 다음 서버들이 먼저 실행되어 있어야 합니다.

### Authorization Server

```
http://localhost:9000
```

OAuth/OIDC 인증을 처리하고 access token과 id token을 발급하는 서버입니다.

### Resource Server

보호된 API와 사용자 데이터를 제공하는 서버입니다.  
클라이언트 애플리케이션은 로그인 후 `access_token`을 이용해 리소스 서버의 보호된 API를 호출합니다.

### 인가 서버 등록 정보

Authorization Server에는 다음 클라이언트 정보가 미리 등록되어 있어야 합니다.

- `client_id`: `oauth2-client-app`
- `client_secret`: `secret`
- `redirect_uri`:
  ```
  http://localhost:3000/api/auth/callback/custom-oauth
  ```
- 허용 scope
  - `openid`
  - `name`
  - `gender`
  - `birthdate`
  - `email`

<br />

## 8. 정리

이 클라이언트 애플리케이션은 **Next.js와 Auth.js를 기반으로 OAuth 2.0 / OpenID Connect 로그인 구조를 구현한 서비스**입니다.

로그인 시 Authorization Code Flow와 PKCE를 사용하여 인가 서버에서 `access_token`과 `id_token`을 발급받고, 이를 세션에 저장합니다. 이후 클라이언트는 `access_token`을 Authorization 헤더에 포함하여 리소스 서버의 보호된 API를 호출합니다.

이를 통해 인증 서버와 API 서버를 분리한 구조에서 안전한 사용자 인증 및 리소스 접근을 구현합니다.

