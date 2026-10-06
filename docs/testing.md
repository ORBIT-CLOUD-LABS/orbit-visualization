# 테스트

- 테스트 파일은 대상 파일과 같은 폴더에 둔다.
- 구현 세부사항이 아니라 사용자가 보는 결과를 검증한다(Testing Library의 `getByRole` 우선).
- API와 SSE는 MSW로 mock한다. 실제 서버를 호출하지 않는다.
- 훅과 `shared/lib` 유틸은 단위 테스트를 작성한다.
