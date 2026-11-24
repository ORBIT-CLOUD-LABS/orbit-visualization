import { Link, matchPath, useLocation } from 'react-router';

import { cn } from '@/shared/lib/cn';

export type SidebarItem = {
  to: string;
  label: string;
  /** true 면 하위 경로에서는 선택되지 않는다. 예: "/" */
  end?: boolean;
  /** to 밖에서도 이 메뉴를 선택 상태로 둘 경로 패턴. 예: ["/vehicles/:vehicleId"] */
  activeFor?: readonly string[];
};

function isItemActive(item: SidebarItem, pathname: string): boolean {
  if (matchPath({ path: item.to, end: item.end ?? false }, pathname) !== null) {
    return true;
  }
  return item.activeFor?.some((pattern) => matchPath(pattern, pathname) !== null) ?? false;
}

type SidebarProps = {
  items: readonly SidebarItem[];
  /** 화면에 보여 줄 가린 토큰. 예: "Bearer ••••••••3f9a" */
  maskedToken: string;
  onChangeToken: () => void;
};

export function Sidebar({ items, maskedToken, onChangeToken }: SidebarProps) {
  // NavLink 는 to 아래 경로만 선택하므로 activeFor 까지 보려고 직접 맞춘다
  const { pathname } = useLocation();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col gap-8 bg-sidebar px-4 py-6">
      <div className="flex items-center gap-2.5 px-2">
        <span aria-hidden="true" className="size-7 rounded-full bg-accent" />
        <p className="flex flex-col">
          <span className="text-md font-bold text-fg-inverse">ORBIT</span>
          <span className="text-2xs text-nav-muted">OTA Console</span>
        </p>
      </div>

      <nav aria-label="주 메뉴">
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const isActive = isItemActive(item, pathname);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    isActive
                      ? 'bg-nav-active font-medium text-fg-inverse'
                      : 'text-nav hover:bg-nav-active/50',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-4 shrink-0 rounded-xs',
                      isActive ? 'bg-fg-inverse' : 'bg-nav-muted',
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col items-start gap-2 rounded-md bg-nav-active p-3">
        <p className="text-2xs text-nav-muted">관리자 토큰</p>
        <p className="font-mono text-2xs break-all text-code">{maskedToken}</p>
        <button
          type="button"
          onClick={onChangeToken}
          className="rounded-xs text-xs font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          토큰 변경
        </button>
      </div>
    </aside>
  );
}
