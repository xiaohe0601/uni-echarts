let uid = 0;

export function useUid(): number {
  uid += 1;

  return uid;
}