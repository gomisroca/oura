export function checkFileType(file: File) {
  const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const fileType = file.type;
  if (!fileTypes.includes(fileType)) {
    return false;
  }
  return true;
}

export function checkFileSize(file: File) {
  const fileSize = file.size;
  if (fileSize > 1024 * 1024 * 2) {
    return false;
  }
  return true;
}
