# 스타일

orbit 은 Tailwind CSS 로 스타일을 쓴다. 컴포넌트 규칙은 [components.md](react/components.md).

## 파일

- 스타일은 Tailwind 유틸리티 클래스로 쓴다. 컴포넌트별 CSS 파일은 만들지 않는다.
- 전역 CSS 는 `src/app/styles/index.css` 하나만 둔다. 이 파일에서 `@import 'tailwindcss';` 로 Tailwind 를 불러온다.

## 디자인 토큰

- 색상, 간격, 폰트 등은 `index.css` 의 `@theme` 에 토큰으로 정의하고, 정의된 토큰만 쓴다.
- 임의 값(`w-[137px]`, `text-[#3b82f6]`)은 쓰지 않는다. 꼭 필요하면 토큰으로 추가한다.

## 클래스 조합

- 조건부 클래스는 `shared/lib/cn.ts` 의 `cn()`(`clsx` + `tailwind-merge`)으로 합친다. 문자열을 직접 이어 붙이지 않는다.
- 클래스 이름을 동적으로 만들지 않는다(`bg-${color}-500` 금지). Tailwind 는 소스에 적힌 클래스 이름만 찾아 CSS 를 만든다.
  값에 따라 바뀌는 클래스는 전체 이름을 매핑 객체에 적어 둔다.
- 클래스 목록이 길어지거나 같은 조합이 반복되면 `@apply` 를 쓰지 않고 `shared/ui` 컴포넌트로 뺀다.
- 클래스 순서는 `prettier-plugin-tailwindcss` 가 정렬한다. → [lint-and-ci.md](typescript/lint-and-ci.md#포맷)
- inline style 은 런타임에 계산되는 값(진행률 width 등)에만 쓴다.

```tsx
const STATUS_CLASS: Record<VehicleStatus, string> = {
  PENDING: 'bg-status-pending',
  UPDATING: 'bg-status-updating',
  COMPLETED: 'bg-status-completed',
  FAILED: 'bg-status-failed',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn('rounded-full px-2 py-1 text-xs', STATUS_CLASS[status], className)}>
      {status}
    </span>
  );
}
```
