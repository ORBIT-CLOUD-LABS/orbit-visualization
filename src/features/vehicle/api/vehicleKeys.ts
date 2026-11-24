export const vehicleKeys = {
  all: ['vehicles'] as const,
  detail: (vehicleId: string) => [...vehicleKeys.all, 'detail', vehicleId] as const,
  history: (vehicleId: string) => [...vehicleKeys.all, 'history', vehicleId] as const,
};
