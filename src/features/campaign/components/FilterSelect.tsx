/** 필터에서 전체를 뜻하는 값 */
export const ALL = '';

type FilterSelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

/** 표 위의 필터. 첫 항목은 전체(ALL) */
export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="flex h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3">
      <span className="text-xs text-fg-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-medium text-fg"
      >
        <option value={ALL}>전체</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
