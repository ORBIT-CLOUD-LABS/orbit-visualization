import type { ReactNode } from 'react';

type AppLayoutProps = {
  /** 보통 <Sidebar /> */
  sidebar: ReactNode;
  /** 화면 본문. 보통 <Topbar /> 와 내용 */
  children: ReactNode;
};

export function AppLayout({ sidebar, children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-canvas">
      {sidebar}
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
