export function debounce(
  func: (...args: unknown[]) => unknown,
  delay: number
): (...args: unknown[]) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
