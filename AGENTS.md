# orbit-visualization

OTA Server의 캠페인·차량 상태를 REST API와 SSE로 받아 시각화하는 프론트엔드입니다.
React + Vite + TypeScript, Tailwind CSS, TanStack Query, axios를 사용합니다.

이 파일은 문서 지도입니다. 세부 규칙은 아래 문서에 있으니, 작업 전에 관련 문서를 먼저 읽습니다.

## 문서 지도

| 문서 | 내용 | 읽어야 할 때 |
| --- | --- | --- |
| [docs/requirements.md](docs/requirements.md) | 요구사항 원본(orbit 레포) 위치와 읽는 방법 | 기능을 구현하기 전에 항상 |
| [docs/project-structure.md](docs/project-structure.md) | 디렉터리 구조, import 규칙, 네이밍 | 파일·폴더를 새로 만들거나 옮길 때 |
| [docs/component.md](docs/component.md) | React 컴포넌트 작성 규칙 | 컴포넌트를 작성·수정할 때 |
| [docs/styling.md](docs/styling.md) | Tailwind CSS 사용 규칙 | 스타일·디자인 토큰을 다룰 때 |
| [docs/data-fetching.md](docs/data-fetching.md) | axios, TanStack Query, SSE, 환경 변수 | API 연동, 실시간 갱신, 환경 변수를 다룰 때 |
| [docs/code-style.md](docs/code-style.md) | TypeScript 규칙, Prettier 설정, import 순서 | 코드를 작성할 때 항상 |
| [docs/testing.md](docs/testing.md) | 테스트 작성 규칙 | 테스트를 작성·수정할 때 |
| [docs/git-conventions.md](docs/git-conventions.md) | Git 규칙 원본(Organization `CONTRIBUTING.md`) 위치와 읽는 방법 | Issue·Branch를 만들거나 커밋·Push·PR·리뷰를 할 때 |
| [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) | PR 작성 양식과 체크리스트 | PR을 만들 때 |

## 문서 관리

- 새 규칙을 정하면 해당 주제의 문서에 추가하고, 이 문서 지도에도 반영한다.
- 새 주제 문서는 `docs/`에 만들고 위 표에 한 줄을 추가한다.
- 이 파일에는 세부 규칙을 직접 쓰지 않는다. 문서 위치와 읽어야 할 시점만 적는다.
