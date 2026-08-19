import { AwesomeRenameBatchReturnType, FileMetadata } from "awesome-renamer";

export const getFilesBasedOnAppliedFilter = (
  files: FileMetadata[],
  filteredFiles: AwesomeRenameBatchReturnType[]
): FileMetadata[] => {
  return files.filter((file) => {
    return (filteredFiles || []).find((filteredFile) => file.path === filteredFile.originalPath);
  });
}