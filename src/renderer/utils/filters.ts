import {
  DatePrecision,
  FileCreatedAtFilter,
  FileMetadata,
  FileModifiedAtFilter,
  FileNameFilter,
  FileSizeFilter,
  FileTypesFilter,
  Filter
} from '../../types';

function isNumber(value): boolean {
  return Number.isFinite(value);
}

function toValidDate(supposedDate: Date | number | string | undefined): Date | undefined {
  if (supposedDate === undefined) return undefined;
  const date = new Date(supposedDate);
  if (isNumber(date.getTime())) return date;
  return undefined;
}

function normalizeDate(date: Date, precision?: DatePrecision): number {
  const time = date.getTime();
  switch (precision) {
    case 'millisecond':
      return time;
    case 'second':
      return Math.floor(time / 1_000);

    case 'minute':
      return Math.floor(time / 60_000);

    case 'hour':
      return Math.floor(time / 3_600_000);

    case 'day':
      return Math.floor(time / 86_400_000);
    default:
      return time;
  }
}

function dateMustBeInRange(
  dateToTest: Date | string | number,
  filter: FileModifiedAtFilter | FileCreatedAtFilter
): boolean {
  const fromDate = toValidDate(filter.from)
    ? normalizeDate(new Date(filter.from!), filter.precision)
    : undefined;
  const toDate = toValidDate(filter.to)
    ? normalizeDate(new Date(filter.to!), filter.precision)
    : undefined;

  const dateToTestTime = normalizeDate(new Date(dateToTest), filter.precision);
  if (!fromDate && !toDate) {
    return true;
  }

  if (!fromDate && toDate) {
    return dateToTestTime <= toDate;
  }
  if (!toDate && fromDate) {
    console.log(fromDate, dateToTestTime);
    return dateToTestTime >= fromDate;
  }
  if (toDate! === fromDate!) {
    return dateToTestTime === toDate;
  }
  return dateToTestTime >= fromDate! && dateToTestTime <= toDate!;
}

const renameFilters = {
  filename: (filename: string, filter: FileNameFilter) => {
    const name = filename.toLowerCase();
    // Narrow to FileNameFilter which contains the name-based criteria
    const fnFilter = (filter || {}) as FileNameFilter;
    const contains = fnFilter.contains ?? [];
    const startsWith = fnFilter.startsWith ?? [];
    const endsWith = fnFilter.endsWith ?? [];

    const matchContains =
      contains.length === 0 || contains.some((criteria) => name.includes(criteria.toLowerCase()));
    const matchStartsWith =
      startsWith.length === 0 ||
      startsWith.some((criteria) => name.startsWith(criteria.toLowerCase()));
    const matchEndsWith =
      endsWith.length === 0 || endsWith.some((criteria) => name.endsWith(criteria.toLowerCase()));

    return matchContains && matchStartsWith && matchEndsWith;
  },
  extension: (filename: string, filter: FileTypesFilter) => {
    const extensions = filter.extensions || [];
    return (
      extensions.length === 0 ||
      extensions.some((criteria) => filename.toLowerCase().endsWith(criteria.toLowerCase()))
    );
  },
  size: (fileSize: number, filter: FileSizeFilter): boolean => {
    const minSize = filter.min;
    const maxSize = filter.min;

    if (!isNumber(minSize) && !isNumber(maxSize)) {
      return true;
    }
    if (minSize && !isNumber(maxSize)) {
      return fileSize >= minSize;
    }
    if (maxSize && !isNumber(minSize)) {
      return fileSize <= maxSize;
    }
    if (minSize === maxSize) {
      return fileSize === maxSize;
    }
    return fileSize >= minSize! && fileSize <= maxSize!;
  },
  dateCreated: (createdAt: Date | string | number, filter: FileCreatedAtFilter): boolean => {
    return dateMustBeInRange(createdAt, filter);
  },
  dateModified: (lastModified: Date | string | number, filter: FileModifiedAtFilter): boolean => {
    return dateMustBeInRange(lastModified, filter);
  }
};

function matchFilter(file: FileMetadata, filter: Filter): boolean {
  switch (filter.type) {
    case 'dateCreated':
      return renameFilters.dateCreated(file.createdAt, filter);
    case 'dateModified':
      return renameFilters.dateModified(file.lastModified, filter);
    case 'extension':
      return renameFilters.extension(file.name, filter);
    case 'filename':
      return renameFilters.filename(file.name, filter);
    case 'size':
      return renameFilters.size(file.size, filter);
  }
}

export function applyFilters(files: FileMetadata[], filters: Filter[]): FileMetadata[] {
  return files.filter((file) => {
    const afterFilters = filters.every((filter) => {
      const filterTest = matchFilter(file, filter);
      console.log(filterTest, filter.type);
      return filterTest;
    });

    return afterFilters;
  });
}
