import { SkeletonRow } from './SkeletonRow';

const VARIANT_CLASS = {
  /** 테두리 상자 안에 행을 쌓는다 */
  bordered: 'overflow-hidden rounded-lg border border-line',
  /** 테두리 없이 행 사이에 줄을 긋는다 */
  divided: 'flex flex-col divide-y divide-line',
} as const;

export type LoadingRowsVariant = keyof typeof VARIANT_CLASS;

type LoadingRowsProps = {
  /** 화면 읽기 도구에 알릴 문구 */
  label?: string;
  rows?: number;
  variant?: LoadingRowsVariant;
};

/** 목록·표를 불러오는 동안의 로딩 행 */
export function LoadingRows({
  label = '불러오는 중',
  rows = 3,
  variant = 'bordered',
}: LoadingRowsProps) {
  return (
    <div aria-busy="true" className={VARIANT_CLASS[variant]}>
      <p className="sr-only">{label}</p>
      {Array.from({ length: rows }, (_, row) => (
        <SkeletonRow key={row} />
      ))}
    </div>
  );
}
