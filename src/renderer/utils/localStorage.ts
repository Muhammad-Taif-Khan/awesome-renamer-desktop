export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  const data = localStorage.getItem(key);
  if (!data) return null;
  return JSON.parse(data) as T;
}
