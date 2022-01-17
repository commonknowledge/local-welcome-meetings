export const asyncSome = async <T>(
  arr: T[],
  predicate: (e: T) => Promise<boolean>,
) => {
  for (const e of arr) {
    /** no-await-in-loop is enabled to make sure the advantage of
     * parallelization in async calls is used, here we do not want
     * that.
     * */
    // eslint-disable-next-line no-await-in-loop
    if (await predicate(e)) return true
  }
  return false
}
