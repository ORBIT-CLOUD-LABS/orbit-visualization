import { http, HttpResponse, type RequestHandler } from 'msw';

const ARTIFACTS_PATH = '/api/v1/admin/artifacts';

export const artifactFixtures = [
  {
    artifactId: 12,
    model: 'MODEL-A',
    version: '1.1.0',
    fileSize: 20_971_520,
    sha256: 'a80ed4b4f2c91e0d7b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d9c21',
    path: '/firmware/MODEL-A/1.1.0/firmware.bin',
    keyId: 'v1',
    createdAt: '2026-10-28T09:00:00Z',
  },
  {
    artifactId: 10,
    model: 'MODEL-B',
    version: '2.0.1',
    fileSize: 25_270_682,
    sha256: 'c2d7e1f0a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6071829344ab',
    path: '/firmware/MODEL-B/2.0.1/firmware.bin',
    keyId: 'v1',
    createdAt: '2026-09-30T09:00:00Z',
  },
];

export function success(data: unknown, code = 'OK') {
  return { isSuccess: true, code, message: '', data, error: null };
}

export function failure(code: string, message = '') {
  return { isSuccess: false, code, message, data: null, error: null };
}

export const artifactHandlers: RequestHandler[] = [
  http.get(ARTIFACTS_PATH, () => HttpResponse.json(success({ artifacts: artifactFixtures }))),
  http.get(`${ARTIFACTS_PATH}/:artifactId`, ({ params }) => {
    const artifact = artifactFixtures.find(
      ({ artifactId }) => String(artifactId) === params.artifactId,
    );
    if (artifact === undefined) {
      return HttpResponse.json(failure('ARTIFACT_NOT_FOUND'), { status: 404 });
    }
    return HttpResponse.json(success(artifact));
  }),
];
