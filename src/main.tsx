// Noto Sans KR 은 unicode-range 로 잘게 나뉜 기본 CSS 를 써서 화면에 나온 글자 조각만 내려받는다
import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/roboto-mono/latin-400.css';
import '@/app/styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('#root 요소를 찾을 수 없습니다. index.html 을 확인하세요');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
