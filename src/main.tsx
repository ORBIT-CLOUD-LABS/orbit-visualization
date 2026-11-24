import '@fontsource/noto-sans-kr/400.css';
import '@fontsource/noto-sans-kr/500.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/roboto-mono/400.css';
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
