# AGENTS.md

orbit-visualization 은 OTA Server 의 캠페인·차량 상태를 REST API 와 SSE 로 받아 시각화하는 React + TypeScript 프론트엔드다.
이 파일은 에이전트 작업 지침의 진입점이다. 작업 전 이 파일을 읽고, 작업 종류에 맞는 문서를 연다.

## 요구사항

요구사항의 원본(source of truth)은 orbit 레포에 있다. 이 레포에 복사하지 않는다.
기능 구현 전에 읽는 방법과 규칙은 [docs/requirements.md](docs/requirements.md).
프로젝트의 목표와 범위도 요구사항 원본을 따른다. 그래서 별도의 방향 문서(agentsmd `project` 프리셋의 `direction.md`)는 두지 않는다.

## 문서 지도

`docs/git/`, `docs/typescript/`, `docs/react/` 는 [agentsmd-kit v0.9.0](https://github.com/xoruddl/agentsmd-kit/tree/v0.9.0) 의 `git`·`typescript`·`react` 프리셋 문서다.
`docs/git/` 과 `.githooks/` 는 Organization 공통 `CONTRIBUTING.md` 형식(브랜치·PR·이슈 제목, `develop` 기준)에 맞게 고쳤다.
orbit 이 프리셋과 다르게 정한 규칙은 따로 두지 않고 해당 문서에 바로 적는다.
프리셋 버전을 올릴 때는 `agentsmd init --force` 로 덮어쓰지 않는다. 이전 원본과 지금 문서의 차이(orbit 수정분)를 새 원본에 다시 적용한다.

| 문서                                                                       | 읽는 시점                                                        |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [docs/requirements.md](docs/requirements.md)                               | 기능 구현 전 (요구사항 확인)                                     |
| [docs/git/workflow.md](docs/git/workflow.md)                               | 모든 작업 시작 전 (필수)                                         |
| [docs/git/git-conventions.md](docs/git/git-conventions.md)                 | 이슈·브랜치·커밋·PR·머지                                         |
| [docs/git/code-review.md](docs/git/code-review.md)                         | PR 리뷰 확인·반영                                                |
| [docs/git/writing-style.md](docs/git/writing-style.md)                     | md 문서, 커밋·PR 메시지 작성                                     |
| [docs/typescript/rules.md](docs/typescript/rules.md)                       | 코드 작성·리뷰 (항상). 컴파일러 옵션, 타입 규칙                  |
| [docs/typescript/structure.md](docs/typescript/structure.md)               | 파일·폴더를 만들 때. 기능 단위 폴더, 모듈 경계                   |
| [docs/typescript/testing.md](docs/typescript/testing.md)                   | 테스트를 쓸 때                                                   |
| [docs/typescript/env-and-security.md](docs/typescript/env-and-security.md) | 환경변수·외부 입력·의존성을 다룰 때                              |
| [docs/typescript/lint-and-ci.md](docs/typescript/lint-and-ci.md)           | 스크립트·린트·포맷·CI 설정                                       |
| [docs/react/components.md](docs/react/components.md)                       | 컴포넌트·훅을 만들 때. 폴더, 화면 상태, 접근성, React 린트 규칙  |
| [docs/react/testing.md](docs/react/testing.md)                             | 컴포넌트·훅·화면 테스트를 쓸 때                                  |
| [docs/react/browser-security.md](docs/react/browser-security.md)           | 공개 환경변수, 사용자 입력을 화면에 그릴 때, 인증 토큰을 다룰 때 |
| [docs/styling.md](docs/styling.md)                                         | 화면 스타일을 쓸 때. Tailwind 토큰, 클래스 조합                  |
| [docs/data-fetching.md](docs/data-fetching.md)                             | 서버와 통신할 때. axios, TanStack Query, SSE                     |

## 핵심 규칙

문서를 다 읽지 못했더라도 아래는 반드시 지킨다.

1. 커밋 하나 = 책임 하나.
2. 커밋 1개 후 작업을 멈추고 사용자 피드백을 기다린다.
3. PR 은 한 가지 목적만 담는다.
4. 커밋·PR 메시지는 사람이 쓴 것처럼 짧게 쓴다. AI 서명 금지.
5. 훅 우회(`--no-verify`) 금지.
6. `any`, `as` 단언, `!` 로 타입 오류를 덮지 않는다.
7. API 응답·저장소 값·URL 파라미터·환경변수는 들어오는 곳에서 검증한다.
8. Promise 는 `await` 하거나 처리한다. `catch` 로 받은 값은 `unknown` 으로 좁혀 쓴다.
9. 기능은 테스트와 함께 쓴다. 버그 수정은 재현 테스트부터 쓴다.
10. 새 의존성은 사용자에게 묻고 추가한다.
11. 클릭할 수 있는 요소는 `<button>`·`<a>` 로 만든다. 이미지에는 `alt`, 입력에는 `label`.
12. 서버 데이터를 그리는 화면은 로딩·오류·빈 결과·성공 상태를 모두 그린다.

## 검증

작업을 마치기 전에 `agentsmd verify` 를 실행하고 결과를 그대로 보고한다. 단계 목록은 `.agentsmd/verify.json`.

```bash
npx @agentsmd/cli@0.9.0 verify   # .agentsmd/verify.json 의 단계(pnpm lint·format:check·typecheck·test·build)를 실행한다
npx @agentsmd/cli@0.9.0 check    # 문서 지도(이 파일)가 docs/ 와 맞는지 검사한다
```

- Node 24 이상(`.nvmrc`)에서 실행한다. 낮은 버전이면 `engine-strict` 때문에 pnpm 명령이 바로 실패한다.
- 문서를 더하거나 옮겼으면 `check` 도 실행한다.

## 지침 관리

- 지침 추가·변경 요청은 메모리에 저장하지 않는다. 이 파일이나 `docs/` 에 반영한다.
- 새 문서를 만들면 위 문서 지도에 한 줄 추가한다.
- 문서 수정도 코드와 같은 커밋 규칙을 따른다.
