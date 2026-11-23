# 폴더 · 모듈

## 폴더

기술 종류(`utils/`, `types/`, `services/`)가 아니라 기능 단위로 나눈다.
orbit 은 기능 폴더를 `features/` 아래에 둔다. 기능 폴더 안의 구성은 [components.md](../react/components.md#폴더).

```text
src/
  app/                진입점, Provider 구성, 라우터
  features/<기능>/    한 기능의 타입·로직·화면·테스트 (예: campaign/, vehicle/)
  shared/             여러 기능이 함께 쓰는 코드
  config.ts           환경변수를 읽고 검증하는 곳 → env-and-security.md
```

- 테스트 파일은 대상 옆에 `<대상>.test.ts` 로 둔다.
- 한 기능 폴더에만 쓰던 코드를 다른 기능도 쓰게 되면 `shared/` 로 옮긴다.
- 새 최상위 폴더를 만들기 전에 사용자에게 묻는다.

## 모듈

- 파일 하나는 책임 하나만 갖는다. 파일 이름은 대표로 내보내는 대상과 같게 한다. → [rules.md](rules.md)
- `features/` 의 기능끼리 서로 가져오지 않는다. 함께 써야 하는 코드는 `shared/` 로 옮긴다.
- `shared/` 는 `features/` 를 가져오지 않는다.
- 다른 폴더의 파일은 `@/` alias(`src/`)로 가져온다. 같은 폴더 안의 파일만 상대 경로를 쓴다.
- 모듈끼리 서로를 가져오는 순환 참조를 만들지 않는다. 생기면 공통 부분을 따로 뺀다.
- 외부 값(API 응답, 환경변수, 저장소 값)을 읽는 코드는 경계 모듈에 모으고, 안쪽 로직은 검증된 타입만 받는다.
