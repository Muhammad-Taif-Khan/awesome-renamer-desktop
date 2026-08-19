import fs from 'fs/promises';
import path from 'path';
import runBatched from '../utils/runBatched';
import { FileMetadata } from '../../types';

async function getFileMetadata(filePath: string): Promise<FileMetadata> {
  const stats = await fs.stat(filePath);
  return {
    lastModified: stats.mtime,
    createdAt: stats.birthtime,
    size: stats.size,
    name: path.basename(filePath),
    path: filePath
  };
}

export async function getFilesMetadata(filesAbsPaths: string[]): Promise<FileMetadata[]> {
  const filesMetadata: FileMetadata[] = await runBatched(
    filesAbsPaths.map((filePath) => async () => {
      const metadata = await getFileMetadata(filePath);
      return metadata;
    }),
    30
  );
  return filesMetadata;
}
