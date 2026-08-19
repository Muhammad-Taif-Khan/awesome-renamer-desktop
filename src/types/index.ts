import IPCTypes from './IPCTypes';

export interface FileMetadata {
  lastModified: Date | string;
  createdAt: Date | string;
  size: number;
  name: string;
  path: string;
}

export interface FileTypesFilter {
  type: 'extension';
  extensions: `.${string}`[];
}

export interface FileNameFilter {
  type: 'filename';
  contains?: string[];
  startsWith?: string[];
  endsWith?: string[];
}
export type FileSizeUnits = "Bytes" | 'KB' | 'MB' | 'GB';

export interface FileSizeFilter {
  type: 'size';
  min?: number;
  max?: number;
}

export type DatePrecision = 'millisecond' | 'second' | 'minute' | 'hour' | 'day';
export interface FileTimestampFilter<T extends 'dateCreated' | 'dateModified'> {
  type: T;
  from?: Date | string | number;
  to?: Date | string | number;
  /**
   * How precise you want the datetime comparison to be, by default the comparison precision will be upto millisecond
   * @default millisecond
   */
  precision?: DatePrecision;
}

export type FileCreatedAtFilter = FileTimestampFilter<'dateCreated'>;
export type FileModifiedAtFilter = FileTimestampFilter<'dateModified'>;

export type Filter =
  FileTypesFilter | FileNameFilter | FileSizeFilter | FileCreatedAtFilter | FileModifiedAtFilter;
export type { IPCTypes };
