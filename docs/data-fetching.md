# 데이터 통신

orbit 은 OTA Server 의 데이터를 REST API 와 SSE 로 받는다. 서버 데이터는 TanStack Query 캐시 하나에 모은다.
폴더 위치는 [components.md](react/components.md#폴더).

## REST API

- HTTP 클라이언트는 axios 를 쓴다. 인스턴스는 `shared/api/httpClient.ts` 에서 `axios.create()` 로 한 번만 만든다.
  기능 코드는 `axios` 를 직접 가져오지 않고 `httpClient` 만 쓴다.
- base URL, timeout, 공통 헤더는 인스턴스를 만들 때 정한다. base URL 은 `src/config.ts` 가 검증한 값을 쓴다. → [browser-security.md](react/browser-security.md#공개-환경변수)
- 인증 헤더 주입과 공통 오류 변환은 인터셉터에서 한다. API 함수마다 반복하지 않는다.
- 기능의 `api/` 에 엔드포인트마다 함수 하나와 요청·응답 타입을 둔다.
  API 함수는 `AxiosResponse` 가 아니라 검증한 응답 데이터를 반환한다. `httpClient.get<Campaign>()` 의 타입 인자는 검증이 아니다. → [rules.md](typescript/rules.md#외부에서-들어온-값은-경계에서-검증한다)
- 재시도와 캐싱은 TanStack Query 에 맡긴다. axios 에서 따로 만들지 않는다.
- 요청 취소는 TanStack Query 가 넘겨주는 `signal` 을 axios 요청 옵션으로 넘겨서 한다.

```ts
// shared/api/httpClient.ts
export const httpClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10_000,
});

// features/campaign/api/getCampaign.ts
export async function getCampaign(id: string, signal?: AbortSignal): Promise<Campaign> {
  const response = await httpClient.get<unknown>(`/campaigns/${id}`, { signal });
  return parseCampaign(response.data); // 형식이 다르면 throw
}
```

## Query key

query key 는 기능마다 팩토리 하나에서 만든다. 훅과 SSE 구독이 같은 팩토리를 쓴다.

```ts
// features/campaign/api/campaignKeys.ts
export const campaignKeys = {
  all: ['campaigns'] as const,
  detail: (id: string) => [...campaignKeys.all, id] as const,
};
```

## SSE

- `EventSource` 생성과 재연결은 `shared/api/sseClient.ts` 가 맡는다. 기능 코드와 컴포넌트는 `EventSource` 를 직접 만들지 않는다.
- SSE 이벤트 데이터도 API 응답처럼 받는 곳에서 검증한다.
- 이벤트를 받으면 따로 상태를 만들지 않고 `queryClient.setQueryData` 로 Query 캐시를 고친다.
- 구독은 기능의 `hooks/` 에 훅으로 두고, 언마운트될 때 연결을 반드시 닫는다.

## 환경변수

- 값을 읽고 검증하는 규칙은 [browser-security.md](react/browser-security.md#공개-환경변수).
- `src/vite-env.d.ts` 에 `VITE_*` 변수 이름을 선언한다.
- 실제 값이 든 `.env.local` 은 커밋하지 않고, 키 목록은 `.env.example` 로 공유한다.
