import { FileSizeUnits } from '../../types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
}

export function convertSizeToBytes(value: number, unit: FileSizeUnits): number {
  const unitsMultiplier: Record<FileSizeUnits, number> = {
    Bytes: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3
  };

  return value * unitsMultiplier[unit];
}
