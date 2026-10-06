# 데이터 통신

## REST API

- HTTP 클라이언트는 axios를 사용한다.
- axios 인스턴스는 `shared/api/httpClient`에서 `axios.create()`로 한 번만 생성한다.
  feature 코드에서는 `axios`를 직접 import하지 않고 `httpClient`만 사용한다.
- base URL, timeout, 공통 헤더는 인스턴스 생성 시 설정한다. base URL은 `VITE_API_BASE_URL`에서 읽는다.
- 인증 헤더 주입과 공통 에러 변환은 인터셉터에서 처리한다. 개별 API 함수에서 반복하지 않는다.
- feature별 `api/` 폴더에 엔드포인트 단위 함수와 요청·응답 타입을 둔다.
  API 함수는 `AxiosResponse`가 아니라 응답 데이터(`response.data`)를 반환한다.
- 서버 데이터는 TanStack Query로 관리한다. 재시도와 캐싱은 TanStack Query에 맡기고 axios에서 따로 구현하지 않는다.
- 요청 취소는 TanStack Query가 넘겨주는 `signal`을 axios 요청 옵션으로 전달해 처리한다.

```ts
// shared/api/httpClient.ts
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

// features/campaign/api/campaignApi.ts
export async function getCampaign(id: string, signal?: AbortSignal): Promise<Campaign> {
  const response = await httpClient.get<Campaign>(`/campaigns/${id}`, { signal });
  return response.data;
}
```

query key는 feature별 팩토리로 한곳에서 정의한다.

```ts
export const campaignKeys = {
  all: ['campaigns'] as const,
  detail: (id: string) => [...campaignKeys.all, id] as const,
};
```

## SSE

- `EventSource` 생성과 재연결은 `shared/api/sseClient`가 담당한다.
- SSE 이벤트를 받으면 별도 상태를 만들지 않고 `queryClient.setQueryData`로 Query 캐시를 갱신한다.
- 구독 훅은 언마운트될 때 연결을 반드시 닫는다.

## 환경 변수

- `VITE_` 접두사를 붙인다. 예: `VITE_API_BASE_URL`
- `src/vite-env.d.ts`에 타입을 선언한다.
- 실제 값이 담긴 `.env.local`은 커밋하지 않고, 키 목록은 `.env.example`로 공유한다.
