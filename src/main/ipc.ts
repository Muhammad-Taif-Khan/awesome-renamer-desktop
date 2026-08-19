import { ipcMain, dialog, app } from 'electron';
import { getFilesMetadata } from './services/file-metadata';
import { justApplyFilters, previewRenameChanges, renameFiles } from './services/rename';

export default async function initIPC(): Promise<void> {
  ipcMain.handle('selectFilesAndGetMetadata', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    });

    if (canceled) {
      return { message: 'File selection canceled', data: [] };
    }

    const filesMetadata = await getFilesMetadata(filePaths);
    return {
      message: 'Files metadata retrieved',
      data: filesMetadata
    };
  });

  ipcMain.handle('getFilesMetadata', async (_, filesPath: string[]) => {
    return getFilesMetadata(filesPath);
  });
  ipcMain.handle('applyFilters', async (_, { files, filters }) => {
    return justApplyFilters(files, filters);
  });

  ipcMain.handle('previewRenameChanges', async (_, { files, rules, options }) => {
    return previewRenameChanges(files, rules, options);
  });
  ipcMain.handle('renameFiles', async (_, { files, rules, options }) => {
    return renameFiles(files, rules, options);
  });
  ipcMain.handle('getAppVersion', () => {
    return app.getVersion();
  });
}
