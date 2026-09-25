/** Raw blob download — no file-saver dependency. */
export function downloadBytes(bytes: number[], filename: string, type = "application/pdf") {
  const blob = new Blob([new Uint8Array(bytes)], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
