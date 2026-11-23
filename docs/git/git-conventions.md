# Git 작업 규칙

원본은 Organization 공통 [`CONTRIBUTING.md`](https://github.com/ORBIT-CLOUD-LABS/.github/blob/main/CONTRIBUTING.md)다.
이 문서는 agentsmd-kit `git` 프리셋을 원본 형식에 맞게 고친 것이고, 둘이 다르면 원본을 따른다. 원본 레포는 읽기만 한다.

```sh
gh api repos/ORBIT-CLOUD-LABS/.github/contents/CONTRIBUTING.md -H 'Accept: application/vnd.github.raw'
```

모든 작업은 **이슈 → 브랜치 → 커밋 → PR → 리뷰 → merge 커밋** 순서로 `develop`에 붙인다.
`main`, `develop`에 직접 커밋·push하지 않는다.

## 1. 이슈

- 작업 전에 이 레포(`orbit-visualization`)에 이슈를 만든다. 빈 이슈는 만들지 않는다.
  다른 레포 변경이 필요하면 레포별 이슈·PR로 나눈다.
- Issue Type은 `Feature`, `Bug`, `Task` 중 하나를 고른다.
- 제목 형식: `[<ISSUE TYPE>] <한국어 요약>` (예: `[FEATURE] Campaign 목록 화면 추가`, `[TASK] requirements.md 수정`)
- `area:*` Label을 하나 고른다. 맞는 것이 없을 때만 생략한다.
  `work:*`, `needs:decision`, `cross-repo`, `risk:security`는 필요할 때만 붙인다.
- 다른 이슈가 끝나야 시작할 수 있으면 `Blocked by`로 선행 이슈를 연결한다.
- 이슈 하나는 브랜치 하나, PR 하나로 끝낼 크기로 잡는다. 크면 이슈를 나눈다.

## 2. 브랜치

형식: `<브랜치 타입>/<이슈번호>-<짧은-설명>` (영어 소문자, 단어는 `-`로 연결)

```sh
git switch develop
git pull
git switch -c feature/12-campaign-list
```

| Issue Type | 브랜치 타입 |
| ---------- | ----------- |
| `Feature`  | `feature`   |
| `Bug`      | `bug`       |
| `Task`     | `task`      |

## 3. 커밋

형식: `<타입>: <한국어 요약>`

| 타입       | 용도                          |
| ---------- | ----------------------------- |
| `feat`     | 새로운 기능이나 동작          |
| `fix`      | 잘못된 동작 수정              |
| `docs`     | 문서 변경                     |
| `refactor` | 외부 동작 변경 없는 구조 개선 |
| `chore`    | 설정, 의존성 및 도구 유지보수 |
| `test`     | 테스트 추가 또는 수정         |
| `ci`       | CI/CD 워크플로 변경           |

- 제목은 50자 이내, 마침표로 끝내지 않는다.
- 무엇을 왜 바꿨는지 드러나게 쓴다. "~ 추가", "~ 수정", "~ 제거"로 끝낸다.
- 커밋 하나는 책임 하나만 담는다. 크기는 [workflow.md](workflow.md).
- 본문은 제목만으로 이유가 안 보일 때만 1~3줄 쓴다. 어떻게 했는지는 diff가 보여 준다.
- AI 서명, 이모지, 과장 수식어를 쓰지 않는다. → [writing-style.md](writing-style.md)

```
좋음
feat: 주문 취소 사유 필드 추가
fix: 토큰 만료 시 무한 리다이렉트 수정

결제 페이지에서 만료 토큰으로 재진입하면 /login 과 /pay 를 반복함.

나쁨
feat: 주문 기능 개선 및 코드 품질 향상          ← 모호함
fix: 인증 로직의 안정성을 강화했습니다.         ← 서술형, 마침표
feat(order): 주문 취소 사유 필드 추가          ← scope 를 쓰지 않는다
```

## 4. PR

```sh
git push -u origin <브랜치>
```

push 후 `develop` 대상 PR을 만든다. 이슈 하나에 PR 하나를 만든다.

- 제목 형식: `[<Issue Type>/#<이슈번호>] <한국어 요약>`. 요약은 커밋 제목과 같은 기준으로 쓴다.

  ```
  좋음  [Feature/#12] Campaign 목록 화면 추가
  좋음  [Task/#9] agentsmd-kit 적용 및 기존 문서 정리
  나쁨  feat: Campaign 목록 화면 추가        ← 커밋 형식
  나쁨  [Feature] Campaign 목록 화면 추가    ← 이슈 번호 없음
  나쁨  [feat/#12] Campaign 목록 화면 추가   ← 커밋 타입
  ```

- 본문은 PR 템플릿(`.github/PULL_REQUEST_TEMPLATE.md`)을 채운다. `Related Issue`에 `Closes #<이슈번호>`를 넣는다.
- `Verification`에는 실제로 실행한 검증과 결과만 적는다. 실행하지 않은 검증을 완료로 표시하지 않는다.
- 변경 내용은 3줄 이내 불릿. 변경 파일을 나열하지 않는다. 빈 섹션은 지운다.
- 커밋 10개, 변경 300줄 이하를 권장한다. 넘으면 PR을 나눈다.
- Secret, Credential, 개인정보를 커밋과 PR에 넣지 않는다.
- CI와 [PR 규칙 검사](#pr-규칙-검사)가 통과해야 머지한다. 리뷰 반영 기준은 [code-review.md](code-review.md).

## 5. 리뷰와 머지

- PR은 최소 한 명의 Approve를 받고, 리뷰 중 생긴 Conversation을 모두 해결해야 머지한다.
  Approve 뒤에 커밋이 추가되면 다시 리뷰받는다.
- 머지는 사람이 한다. 에이전트는 Approve·Conversation 해결·머지를 대신하지 않는다.
- merge 커밋을 만드는 방식으로 머지한다. squash·rebase 머지는 쓰지 않는다.
  브랜치의 커밋 이력을 그대로 남기고, 기능 단위로 되돌릴 때 `git revert -m 1 <merge 커밋>`을 쓰기 위해서다.
  PR을 열면 `.github/workflows/enable-auto-merge.yml`이 auto-merge(merge 커밋 방식)를 켠다.
- 머지 후 브랜치는 삭제한다.
- `develop`이 앞서 나가면 브랜치에 `develop`을 merge해서 충돌을 미리 해결한다. push한 이력은 rebase하지 않는다.

```sh
git switch feature/12-campaign-list
git merge develop
```

- `--force` push와 훅 우회(`--no-verify`)는 하지 않는다.
  `develop`·`main`의 직접 push와 force push는 레포 ruleset(`protect-default`)이 막고, 에이전트 설정(`.claude/settings.json`)은 흔한 명령만 한 번 더 막는다.

## 자동 검사

| 위치                             | 검사                                                   |
| -------------------------------- | ------------------------------------------------------ |
| `.githooks/commit-msg`           | 커밋 형식, 제목 50자, 마침표, AI 서명                  |
| `.github/workflows/pr-rules.yml` | PR마다 `.githooks/check-pr` 실행: 브랜치 이름, PR 제목 |

훅은 `agentsmd init`이 연결한다. 이미 다른 훅 디렉터리를 쓰고 있으면 바꾸지 않고, 직접 연결하는 명령을 알려 준다.
직접 연결하려면 `git config core.hooksPath .githooks`. 경로는 저장소 최상위 기준으로 적는다.

### PR 규칙 검사

로컬 훅은 각자 PC에서만 돌기 때문에, PR 규칙은 CI에서 한 번 더 검사한다.
`check-pr`는 브랜치 이름과 PR 제목의 형식, 둘의 Issue Type·이슈 번호가 같은지를 본다.

- 검사가 머지를 막으려면 레포 ruleset의 required status check에 `check-pr` 작업을 넣어야 한다.
  넣지 않으면 실패해도 auto-merge로 머지될 수 있다.
- 로컬에서는 `BRANCH=<브랜치> TITLE="<PR 제목>" .githooks/check-pr`로 돌린다. 실패하면 종료 코드 1, 값이 없으면 2.
- 제목은 PR 작성자가 쓴 값이다. 워크플로 스크립트에 직접 끼워 넣지 말고 환경변수로 넘긴다.

### 문서 지도 검사를 CI에 연결

문서를 손으로 더하거나 빼거나 옮기면 `AGENTS.md`의 문서 지도가 어긋난다.
`agentsmd check`를 PR마다 돌리려면 워크플로에 `uses: xoruddl/agentsmd-kit@v0` 한 단계를 넣는다. 지금은 연결돼 있지 않다.
