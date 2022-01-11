export function logToDebug(eventName: string, data?: any) {
  console.debug(eventName, data)
  window?.posthog?.capture?.(eventName, data)
}
