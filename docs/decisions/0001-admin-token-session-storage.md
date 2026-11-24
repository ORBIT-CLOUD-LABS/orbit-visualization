# 0001. 관리자 토큰을 sessionStorage 에 둔다

- 상태: 채택 (2026-11-24)
- 관련: [browser-security.md](../react/browser-security.md#인증-정보), orbit-visualization#16

## 배경

- OTA Server 관리자·대시보드 API 는 고정 관리자 토큰을 `Authorization: Bearer` 헤더로 받는다. 로그인 API 와 쿠키 발급이 없다.
- 차량 상태 SSE 도 같은 헤더가 필요해 fetch 기반으로 연결한다. → [data-fetching.md](../data-fetching.md#sse)
- 그래서 `httpOnly` 쿠키를 쓸 수 없고, 스크립트가 토큰을 읽어 헤더에 넣어야 한다.

## 결정

- 01 화면에서 입력받은 토큰을 `sessionStorage` 의 `orbit.adminToken` 에 둔다.
- 읽고 쓰는 곳은 `src/shared/auth/tokenStorage.ts` 하나다. 읽을 때 형식을 검증하고, 다르면 지운다.
- 서버가 401 을 주면 토큰을 지우고 01 로 보낸다.

## 대안

| 대안 | 고르지 않은 이유 |
| --- | --- |
| `localStorage` | 브라우저를 닫아도 남는다. 공용 PC 에서 토큰이 오래 노출된다 |
| 메모리(변수)만 | 새로고침할 때마다 토큰을 다시 입력해야 한다 |
| `httpOnly` 쿠키 | 서버에 쿠키 발급·CSRF 대응이 없다. 서버 변경이 필요하다 |

## 감수하는 위험

- XSS 가 생기면 스크립트가 토큰을 읽을 수 있다. `dangerouslySetInnerHTML` 금지 등 [browser-security.md](../react/browser-security.md) 규칙으로 막는다.
- 탭을 닫으면 토큰이 사라져 다시 입력해야 한다.
- 서버가 쿠키 기반 인증을 제공하면 이 결정을 다시 본다.
