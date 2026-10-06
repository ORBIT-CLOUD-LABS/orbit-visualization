# 컴포넌트

- `function` 선언으로 작성하고 `React.FC`는 쓰지 않는다.
- named export만 사용한다. default export는 `React.lazy`로 불러오는 라우트 컴포넌트에만 허용한다.
- 컴포넌트는 렌더링만 맡는다. 데이터 조회와 SSE 구독은 훅으로, HTTP 호출은 `api` 계층으로 분리한다.
  컴포넌트 안에서 `fetch`나 `EventSource`를 직접 사용하지 않는다.
- 데이터를 보여주는 화면은 loading, empty, error 상태를 모두 처리한다.
- 한 파일에는 export하는 컴포넌트를 하나만 둔다.

```tsx
type CampaignDetailProps = {
  campaignId: string;
};

export function CampaignDetail({ campaignId }: CampaignDetailProps) {
  const { data, isPending, isError } = useCampaign(campaignId);

  if (isPending) return <Spinner />;
  if (isError) return <ErrorMessage />;
  if (data.vehicles.length === 0) return <EmptyState />;

  return <VehicleList vehicles={data.vehicles} />;
}
```
