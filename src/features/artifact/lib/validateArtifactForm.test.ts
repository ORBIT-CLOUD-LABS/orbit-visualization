import { describe, expect, it } from 'vitest';

import type { ArtifactFormValues } from './artifactFormSchema';
import { validateArtifactForm } from './validateArtifactForm';

const file = new File(['abcd'], 'firmware.bin');

const valid: ArtifactFormValues = {
  file,
  model: ' MODEL-A ',
  version: '1.1.0',
  sha256: '',
  signature: 'Kx8f2==\n',
  keyId: 'v1',
};

function errorsOf(values: Partial<ArtifactFormValues>) {
  const result = validateArtifactForm({ ...valid, ...values });
  return result.success ? {} : result.errors;
}

describe('validateArtifactForm', () => {
  it('앞뒤 공백을 지우고 빈 SHA-256 은 보내지 않는다', () => {
    expect(validateArtifactForm(valid)).toEqual({
      success: true,
      input: {
        file,
        model: 'MODEL-A',
        version: '1.1.0',
        sha256: undefined,
        signature: 'Kx8f2==',
        keyId: 'v1',
      },
    });
  });

  it('필수값이 비면 칸마다 알려 준다', () => {
    expect(
      errorsOf({ file: null, model: ' ', version: '', signature: '', keyId: '' }),
    ).toMatchObject({
      file: '업데이트 파일을 선택하세요',
      model: '차종을 입력하세요',
      version: '버전을 입력하세요',
      signature: '서명을 입력하세요',
      keyId: '키 버전을 입력하세요',
    });
  });

  it.each(['1', '1.0.10', '123456789.0'])('버전 %s 는 받는다', (version) => {
    expect(errorsOf({ version }).version).toBeUndefined();
  });

  it.each(['v1.0', '1.0.', '1..0', '1234567890', '1.0-beta'])('버전 %s 는 거절한다', (version) => {
    expect(errorsOf({ version }).version).toBe('숫자와 점으로 입력하세요 (예: 1.0.1)');
  });

  it('차종에 / 를 넣거나 50자를 넘으면 거절한다', () => {
    expect(errorsOf({ model: 'A/B' }).model).toBe('`/` 는 사용할 수 없습니다');
    expect(errorsOf({ model: 'A'.repeat(51) }).model).toBe('50자 이하로 입력하세요');
  });

  it('SHA-256 은 hex 64자만 받는다', () => {
    expect(errorsOf({ sha256: 'A'.repeat(64) }).sha256).toBeUndefined();
    expect(errorsOf({ sha256: 'g'.repeat(64) }).sha256).toBe('hex 64자로 입력하세요');
    expect(errorsOf({ sha256: 'a'.repeat(63) }).sha256).toBe('hex 64자로 입력하세요');
  });

  it('Vault 출력을 통째로 붙이면 서명값만 넣으라고 알려 준다', () => {
    expect(errorsOf({ signature: 'vault:v1:Kx8f2==' }).signature).toBe(
      '`vault:v1:` 를 빼고 서명값만 입력하세요',
    );
  });

  it('1GB 를 넘는 파일은 거절한다', () => {
    const large = new File([], 'large.bin');
    Object.defineProperty(large, 'size', { value: 1024 ** 3 + 1 });

    expect(errorsOf({ file: large }).file).toBe('1GB 이하 파일만 등록할 수 있습니다');
  });
});
