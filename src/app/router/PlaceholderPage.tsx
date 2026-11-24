type PlaceholderPageProps = {
  title: string;
};

/** 화면을 구현하기 전까지 경로만 확인하는 임시 화면. 각 기능 이슈에서 실제 화면으로 바꾼다 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}
