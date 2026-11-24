import { useId } from 'react';

export type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: readonly FilterOption[];
  onChange: (value: string) => void;
};

/** 이름이 상자 안 왼쪽에 붙는 필터 선택 상자 (예: "차종 전체") */
export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const id = useId();

  return (
    <div className="flex h-10 items-center gap-2 rounded-md border border-line bg-surface pl-3 focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-primary">
      <label htmlFor={id} className="text-xs text-fg-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full min-w-24 bg-transparent pr-3 text-sm font-medium text-fg outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
