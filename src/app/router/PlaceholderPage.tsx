import { Topbar } from '@/shared/ui/Topbar';

type PlaceholderPageProps = {
  title: string;
};

/** 화면을 구현하기 전까지 경로만 확인하는 임시 화면. 각 기능 이슈에서 실제 화면으로 바꾼다 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  // 레이아웃이 <main> 으로 감싸므로 머리글만 그린다
  return <Topbar title={title} />;
}
