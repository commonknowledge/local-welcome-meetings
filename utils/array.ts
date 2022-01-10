export const asyncSome = async <T>(
  arr: T[],
  predicate: (e: T) => Promise<boolean>,
) => {
  for (const e of arr) {
    if (await predicate(e)) return true
  }
  return false
}
