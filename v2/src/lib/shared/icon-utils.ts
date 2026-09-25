/**
 * Raw filename-extension -> icon lookup — no `mime` package. Matches the
 * fixed icon set already shipped in public/global/images.
 */
const EXTENSION_ICONS: Record<string, string> = {
  pdf: "pdf-icon.svg",
  doc: "doc-icon.svg",
  docx: "doc-icon.svg",
  xls: "xls-icon.svg",
  xlsx: "xls-icon.svg",
  ppt: "ppt-icon.svg",
  pptx: "ppt-icon.svg",
  txt: "txt-icon.svg",
};

export function getFileIcon(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_ICONS[extension] ?? "file-unknown-icon.svg";
}
