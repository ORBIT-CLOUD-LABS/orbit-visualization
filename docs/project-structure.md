# 프로젝트 구조

## 디렉터리 구조

기능(feature) 단위로 나눈다.

```
src/
  app/                # 진입점, Provider 구성, 라우터
  features/
    campaign/
      api/            # 서버 호출 함수와 요청·응답 타입
      hooks/          # 데이터 조회·SSE 구독 훅
      components/     # 화면 컴포넌트
      types.ts        # 도메인 타입
    vehicle/
  shared/
    api/              # httpClient, sseClient 등 공용 통신 계층
    ui/               # 도메인을 모르는 공용 컴포넌트
    lib/              # 순수 유틸 함수
```

## import 규칙

- `features/*`끼리 서로 import하지 않는다. 함께 써야 하는 코드는 `shared`로 옮긴다.
- `shared`는 `features`를 import하지 않는다.
- import 경로에는 `@/` alias(`src/`)를 사용한다. 같은 폴더 안의 파일은 상대 경로를 써도 된다.

## 네이밍

| 대상 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 파일·이름 | PascalCase | `CampaignDetail.tsx` |
| 훅 | `use` 접두사 + camelCase | `useCampaign.ts` |
| 그 외 파일 | camelCase | `campaignApi.ts`, `formatDate.ts` |
| 테스트 파일 | 대상 파일명 + `.test.ts(x)` | `CampaignDetail.test.tsx` |
| 타입·인터페이스 | PascalCase, `I`·`T` 접두사 금지 | `Campaign`, `VehicleStatus` |
| Props 타입 | 컴포넌트명 + `Props` | `CampaignDetailProps` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| boolean 변수 | `is`·`has`·`should` 접두사 | `isLoading`, `hasError` |
| 이벤트 핸들러 | 내부는 `handle*`, props는 `on*` | `handleClick`, `onSelect` |
