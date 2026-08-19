import { AwesomeRenameBatchReturnType, RenameOptions, RenameRule } from 'awesome-renamer';
import { FileMetadata, Filter } from '.';

export type MainResponse<T> = {
  message?: string;
  error?: string;
  data: T | undefined;
};
export type PromisedMainResponse<T> = Promise<MainResponse<T>>;

export default interface IPCTypes {
  getMetadataForFiles: ({
    files,
    method
  }: {
    files?: File[];
    method?: 'native' | 'web';
  }) => PromisedMainResponse<FileMetadata[]>;
  applyFilters: ({
    files,
    filters
  }: {
    files: FileMetadata[];
    filters?: Filter[];
  }) => PromisedMainResponse<AwesomeRenameBatchReturnType[]>;
  previewRenameChanges: ({
    files,
    rules,
    options
  }: {
    files: FileMetadata[];
    rules: RenameRule[];
    options?: Pick<RenameOptions, 'onInvalidChar'>;
  }) => PromisedMainResponse<(AwesomeRenameBatchReturnType & { id: string })[]>;
  renameFiles: ({
    files,
    rules,
    options
  }: {
    files: FileMetadata[];
    rules: RenameRule[];
    options?: Pick<RenameOptions, 'onInvalidChar'>;
  }) => PromisedMainResponse<AwesomeRenameBatchReturnType[]>;
  getAppVersion: () => Promise<string>;
}
