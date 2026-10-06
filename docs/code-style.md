# 코드 스타일

## TypeScript

- `any`를 금지한다. 타입을 알 수 없는 외부 입력은 `unknown`으로 받아 좁힌다.
- 객체 타입은 `type`으로 선언한다. 선언 병합이 필요할 때만 `interface`를 쓴다.
- 타입만 가져올 때는 `import type`을 사용한다.
- `enum` 대신 문자열 리터럴 유니온과 `as const` 객체를 사용한다.
- non-null assertion(`!`)은 피하고 타입 가드로 처리한다.

```ts
export const VEHICLE_STATUS = {
  PENDING: 'PENDING',
  UPDATING: 'UPDATING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type VehicleStatus = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];
```

## 포맷

Prettier 설정을 따르며, 기본 설정은 다음과 같다.

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/app/styles/index.css"
}
```

## import 순서

그룹을 나누고, 그룹 사이에 빈 줄을 둔다.

1. 외부 라이브러리 (`react`, `@tanstack/react-query` 등)
2. 내부 alias (`@/shared/...`, `@/features/...`)
3. 상대 경로 (`./`, `../`)
