import { useState } from 'react';

import {
  createMapPathStyles,
  readDocumentTokenColor,
  type MapPathStyles,
} from './createMapPathStyles';

/** 문서 색 토큰으로 만든 지도 도형 스타일. 테마가 바뀌지 않으므로 처음 한 번만 읽는다 */
export function useMapPathStyles(): MapPathStyles {
  const [styles] = useState(() => createMapPathStyles(readDocumentTokenColor));
  return styles;
}
