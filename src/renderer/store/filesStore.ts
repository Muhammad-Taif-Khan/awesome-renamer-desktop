import { create } from 'zustand';
import { FileMetadata } from '../../types';
type FileStoreType = {
  files: FileMetadata[];
  setFiles: (files: FileMetadata[]) => void;
  addFiles: (files: FileMetadata[])=> FileMetadata[];
  removeFiles: (fileIds: string[]) => void;
  clearFiles: () => void;
};
export const useFilesStore = create<FileStoreType>((set, get) => ({
  files: [],
  setFiles(files) {
    set({ files });
  },
  removeFiles: (files) => {
    set((state) => ({
      files: state.files.filter((stateFile) => {
        return !files.find((fileToRemove) => stateFile.path === fileToRemove);
      })
    }));
  },
  addFiles: (newFiles) => {
    const updatedFiles = structuredClone(get().files);
    newFiles.forEach((newFile) => {
      if (!updatedFiles.find((file) => file.path === newFile.path)) {
        updatedFiles.push(newFile);
      }
    });

    set({ files: updatedFiles });
    return updatedFiles;
  },
  clearFiles: () => {
    set({ files: [] });
  }
}));
