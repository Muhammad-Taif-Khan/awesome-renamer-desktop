import {
  awesomeRenameBatch,
  AwesomeRenameBatchReturnType,
  AwesomeRenameReturnValue,
  RenameOptions,
  RenameRule
} from 'awesome-renamer';
import { FileMetadata, Filter } from '../../types';
import { PromisedMainResponse } from '../../types/IPCTypes';
import crypto from 'crypto';

function getUUID(): string {
  return crypto.randomUUID();
}
export async function justApplyFilters(
  filesPath: FileMetadata[],
  filters: Filter[]
): PromisedMainResponse<AwesomeRenameBatchReturnType[] | undefined> {
  try {
    const res = await awesomeRenameBatch(
      filesPath.map((file) => {
        return {
          oldPath: file.path,
          newName: file.name
        };
      }),
      {
        filters,
        dryRun: true,
        
      }
    );
    return {
      data: res,
      message: 'Filter applied'
    };
  } catch (error) {
    return {
      error: (error as Error).message,
      data: undefined
    };
  }
}

export async function previewRenameChanges(
  files: FileMetadata[],
  rules: (RenameRule)[],
  options?: Pick<RenameOptions, 'onInvalidChar'>
): PromisedMainResponse<AwesomeRenameBatchReturnType[]> {
  try {
    const res = await awesomeRenameBatch(
      files.map((file) => ({ oldPath: file.path, newName: file.name })),
      {
        rules,
        dryRun: true,
        onInvalidChar: options?.onInvalidChar || 'error',
        preserveExtension: false
      }
    );
    //add uids
    for (const change of res) {
      (change as unknown as AwesomeRenameReturnValue & { id: string }).id = getUUID();
    }
    return {
      data: res,
      message: 'Filter applied'
    };
  } catch (error) {
    return {
      data: undefined,
      error: `Failed to preview changes: ${(error as Error).message}`
    };
  }
}
export async function renameFiles(
  files: FileMetadata[],
  rules: RenameRule[],
  options?: Pick<RenameOptions, 'onInvalidChar'>
): PromisedMainResponse<AwesomeRenameBatchReturnType[]> {
  try {
    const res = await awesomeRenameBatch(
      files.map((file) => ({ oldPath: file.path, newName: file.name })),
      {
        rules,
        onInvalidChar: options?.onInvalidChar || 'error',
        preserveExtension: false
      }
    );

    return {
      data: res,
      message: 'Files renamed successfully'
    };
  } catch (error) {
    return {
      data: undefined,
      error: `Failed to rename files: ${(error as Error).message}`
    };
  }
}
