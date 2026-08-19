import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { FileMetadata, IPCTypes } from '../types';
import { PromisedMainResponse } from '../types/IPCTypes';
import { createTitlebarOnDOMContentLoaded } from 'custom-electron-titlebar';

// Theme configuration is automatically loaded from main process
createTitlebarOnDOMContentLoaded({
  titleHorizontalAlignment: 'left',
  removeMenuBar: true
});

async function _getMetadataForFiles({
  files,
  method
}: {
  files?: File[];
  method?: 'native' | 'web';
}): PromisedMainResponse<FileMetadata[]> {
  if (method === 'native') {
    return ipcRenderer.invoke('selectFilesAndGetMetadata');
  }

  return {
    message: 'Files metadata retrieved',
    data: await ipcRenderer.invoke(
      'getFilesMetadata',
      (files || []).map((file) => {
        return webUtils.getPathForFile(file);
      })
    )
  };
}
// Custom APIs for renderer
const electronAPI: IPCTypes = {
  getMetadataForFiles: async ({ files, method }) => {
    return _getMetadataForFiles({ files, method });
  },
  applyFilters: (args) => ipcRenderer.invoke('applyFilters', args),
  previewRenameChanges: (args) => ipcRenderer.invoke('previewRenameChanges', args),
  renameFiles: (args) => ipcRenderer.invoke('renameFiles', args),
  getAppVersion: () => ipcRenderer.invoke('getAppVersion')
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
}
