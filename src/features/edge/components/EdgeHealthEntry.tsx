import { cn } from '@/shared/lib/cn';
import { TONE_CLASS, type Tone } from '@/shared/ui/toneClass';

type EdgeHealthEntryProps = {
  tone: Tone;
  title: string;
  detail: string;
  /** 바뀌기 전후 값처럼 고정폭으로 읽는 detail 이면 true */
  isMonoDetail?: boolean;
};

/** 상태 변화 카드의 한 줄. 목록(ul·ol) 안에 둔다 */
export function EdgeHealthEntry({
  tone,
  title,
  detail,
  isMonoDetail = false,
}: EdgeHealthEntryProps) {
  const toneClass = TONE_CLASS[tone];

  return (
    <li className={cn('flex items-center gap-2.5 rounded-md px-3.5 py-3', toneClass.surface)}>
      <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', toneClass.dot)} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-sm font-medium break-all">{title}</p>
        <p className={cn('text-2xs', isMonoDetail && 'font-mono')}>{detail}</p>
      </div>
    </li>
  );
}
