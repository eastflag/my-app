export const getExtension = (fileName: string) => {
  const splitResult = fileName.split('.');
  if (splitResult.length <= 1) return '';
  return splitResult.pop();
};

export const getFileSizeByteToMb = (byteSize: number) => {
  return Math.floor(byteSize / (1024 * 1024));
};

export const getFileDirectoryByUrl = (fileUrl: string | undefined) => {
  if (fileUrl == undefined) return '';
  if (fileUrl.length <= 1) return '';
  return fileUrl.slice(fileUrl.indexOf('.com/') + 5);
};

// TODO : extension 추가
export const ImageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'svg'];
export const AudioExtensions = ['mp3', 'wav', 'ogg'];
export const VideoExtensions = ['mp4', 'avi'];
export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  MODEL_3D = '3D_MODEL',
}
export const FileTypeMap = new Map([
  [FileType.IMAGE, ImageExtensions],
  [FileType.VIDEO, VideoExtensions],
  [FileType.AUDIO, AudioExtensions],
  [FileType.MODEL_3D, []],
]);

export const getFileTypeFromExtenstion = (fileUrl: string) => {
  let fileType: FileType | string = '';

  FileTypeMap.forEach((v, key) => {
    if (v.some((extension) => fileUrl.toLowerCase().endsWith(extension.toLowerCase()))) {
      fileType = key;
      return;
    }
  });

  return fileType;
};
