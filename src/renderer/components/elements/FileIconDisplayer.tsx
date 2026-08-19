import React from "react";
import {
  FileTwoTone,
  FileTextTwoTone,
  FilePdfTwoTone,
  FileWordTwoTone,
  FileExcelTwoTone,
  FilePptTwoTone,
  FileZipTwoTone,
  FileImageTwoTone,
  FileMarkdownTwoTone,
  FileUnknownTwoTone,
  AudioTwoTone,
  CodeTwoTone,
  VideoCameraTwoTone,
  Html5TwoTone,
} from "@ant-design/icons";

type Props = {
  name: string;
  size?: number;
};

const extensionMap: Record<string, React.ReactNode> = {
  // Images
  jpg: <FileImageTwoTone />,
  jpeg: <FileImageTwoTone />,
  png: <FileImageTwoTone />,
  gif: <FileImageTwoTone />,
  bmp: <FileImageTwoTone />,
  webp: <FileImageTwoTone />,
  svg: <FileImageTwoTone />,
  ico: <FileImageTwoTone />,
  tif: <FileImageTwoTone />,
  tiff: <FileImageTwoTone />,

  // PDF
  pdf: <FilePdfTwoTone />,

  // Word
  doc: <FileWordTwoTone />,
  docx: <FileWordTwoTone />,

  // Excel
  xls: <FileExcelTwoTone />,
  xlsx: <FileExcelTwoTone />,
  csv: <FileExcelTwoTone />,

  // PowerPoint
  ppt: <FilePptTwoTone />,
  pptx: <FilePptTwoTone />,

  // Archives
  zip: <FileZipTwoTone />,
  rar: <FileZipTwoTone />,
  "7z": <FileZipTwoTone />,
  tar: <FileZipTwoTone />,
  gz: <FileZipTwoTone />,

  // Text
  txt: <FileTextTwoTone />,
  log: <FileTextTwoTone />,
  rtf: <FileTextTwoTone />,

  // Markdown
  md: <FileMarkdownTwoTone />,

  // Code
  js: <CodeTwoTone />,
  jsx: <CodeTwoTone />,
  ts: <CodeTwoTone />,
  tsx: <CodeTwoTone />,
  json: <CodeTwoTone />,
  html: <Html5TwoTone />,
  css: <CodeTwoTone />,
  scss: <CodeTwoTone />,
  less: <CodeTwoTone />,
  xml: <CodeTwoTone />,
  yaml: <CodeTwoTone />,
  yml: <CodeTwoTone />,
  c: <CodeTwoTone />,
  cpp: <CodeTwoTone />,
  h: <CodeTwoTone />,
  java: <CodeTwoTone />,
  py: <CodeTwoTone />,
  go: <CodeTwoTone />,
  rs: <CodeTwoTone />,
  php: <CodeTwoTone />,
  sh: <CodeTwoTone />,

  // Audio
  mp3: <AudioTwoTone />,
  wav: <AudioTwoTone />,
  flac: <AudioTwoTone />,
  aac: <AudioTwoTone />,
  ogg: <AudioTwoTone />,

  // Video
  mp4: <VideoCameraTwoTone />,
  avi: <VideoCameraTwoTone />,
  mov: <VideoCameraTwoTone />,
  mkv: <VideoCameraTwoTone />,
  webm: <VideoCameraTwoTone />,
};

function FileIconDisplayer({ name }: Props): React.ReactNode {
  const extension = name.includes(".")
    ? name.split(".").pop()!.toLowerCase()
    : "";

  const icon =
    extensionMap[extension] ??
    (extension ? <FileUnknownTwoTone /> : <FileTwoTone />);

  return <span style={{ fontSize: 20 }}>{icon}</span>;
}

export default FileIconDisplayer;