let uid = 0;

export function useUid() {
  uid += 1;

  return uid;
}