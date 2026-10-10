# 스타일

- 스타일은 Tailwind 유틸리티 클래스로 작성한다. 컴포넌트별 CSS 파일은 만들지 않는다.
- 전역 CSS는 `src/app/styles/index.css` 하나만 둔다. 이 파일에서 `@import 'tailwindcss';`로 Tailwind를 불러온다.
- 색상, 간격, 폰트 등 디자인 토큰은 `index.css`의 `@theme`에 정의하고, 정의된 토큰만 사용한다.
  임의 값(`w-[137px]`, `text-[#3b82f6]`)은 쓰지 않는다. 꼭 필요하면 토큰으로 추가한다.
- 조건부 클래스는 `shared/lib/cn.ts`(`clsx` + `tailwind-merge`)의 `cn()`으로 합친다. 문자열을 직접 이어 붙이지 않는다.
- 클래스 이름을 동적으로 조합하지 않는다(`bg-${color}-500` 금지). Tailwind가 빌드 시 감지할 수 있도록 전체 클래스명을 매핑 객체에 적어 둔다.
- 클래스 목록이 길어지거나 같은 조합이 반복되면 `@apply`를 쓰지 말고 `shared/ui` 컴포넌트로 추출한다.
- 클래스 순서는 `prettier-plugin-tailwindcss`가 자동으로 정렬한다.
- inline style은 런타임에 계산되는 값(예: 진행률 width)에만 사용한다.

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
