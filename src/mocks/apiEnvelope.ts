// 서버 공통 응답 형식 { isSuccess, code, message, data, error } 을 만든다. 기능별 핸들러와 테스트가 함께 쓴다

export function success(data: unknown, code = 'OK') {
  return { isSuccess: true, code, message: '', data, error: null };
}

export function failure(code: string, message = '') {
  return { isSuccess: false, code, message, data: null, error: null };
}
