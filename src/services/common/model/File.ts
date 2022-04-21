export enum BucketType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum FileActionType {
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
}

export interface PresignedUrlFile {
  additionExpireTime?: number;
  bucketType: BucketType;
  fileActionType: FileActionType;
  fileName: string;
  preSignedUrl: string;
}

export interface PresignedUrlFiles {
  presignedUrlFiles: PresignedUrlFile[];
}

export interface S3FileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  src: {
    file: File;
    base64?: string;
    link?: string;
  };
}

export interface UploadInfo {
  additionExpireTime?: number;
  bucketType: BucketType;
  fileActionType: FileActionType;
  files: File[];
  fileDirectory: string;
}

export interface s3UploadInfo {
  [key: string]: string;
}
