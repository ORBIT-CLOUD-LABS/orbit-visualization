import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert } from './Alert';
import { Button } from './Button';

describe('Alert', () => {
  it('오류는 alert 로 제목과 code 를 알린다', () => {
    render(
      <Alert
        type="error"
        title="캠페인 목록을 불러오지 못했습니다"
        code="INTERNAL_SERVER_ERROR"
        action={<Button variant="secondary">다시 시도</Button>}
      />,
    );

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('캠페인 목록을 불러오지 못했습니다');
    expect(alert).toHaveTextContent('INTERNAL_SERVER_ERROR');
    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });

  it('제목 아래 안내 문구를 함께 보여 준다', () => {
    render(
      <Alert
        type="error"
        title="서명 검증에 실패했습니다"
        description="키 버전이 맞는지 확인하세요"
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      /^서명 검증에 실패했습니다키 버전이 맞는지 확인하세요$/,
    );
  });

  it('주의·안내는 status 로 알린다', () => {
    render(
      <>
        <Alert type="warning" title="일부 Edge 가 응답하지 않습니다" />
        <Alert type="info" title="저장된 토큰이 없습니다" />
      </>,
    );

    const statuses = screen.getAllByRole('status');
    expect(statuses).toHaveLength(2);
    expect(statuses[0]).toHaveTextContent(/^일부 Edge 가 응답하지 않습니다$/);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
