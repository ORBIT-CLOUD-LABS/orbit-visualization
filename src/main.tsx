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
