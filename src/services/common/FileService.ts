import BaseService from './BaseService';
import { S3FileInfo, PresignedUrlFile, PresignedUrlFiles, UploadInfo } from './model/File';
import { Method } from './model/Method';
import { BeApiRequest, BeApiResponse } from './model/RestApi';
import { Service } from './model/Service';
import { s3ServiceInstance } from './S3Service';

class FileService extends BaseService {
  async getPresignedInfo(presignedUrlRequest: PresignedUrlFiles) {
    const beApiRequest: BeApiRequest = {
      method: Method.POST,
      url: `/marketplace/v1/file/presignedUrl`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: presignedUrlRequest,
      },
    };

    const result: BeApiResponse<PresignedUrlFiles> = await this.fnRest(beApiRequest);

    return result;
  }

  async fileUpload(uploadInfo: UploadInfo) {
    const signedUrlList: PresignedUrlFile[] = [];

    uploadInfo.files.map((file) => {
      const signedUrl: PresignedUrlFile = {
        additionExpireTime: uploadInfo.additionExpireTime,
        bucketType: uploadInfo.bucketType,
        fileActionType: uploadInfo.fileActionType,
        fileName: uploadInfo.fileDirectory + '/' + file.name,
        preSignedUrl: '',
      };

      signedUrlList.push(signedUrl);
    });

    const result = await this.getPresignedInfo({ presignedUrlFiles: signedUrlList });

    if (result?.successOrNot === 'Y') {
      for (let inx = 0; inx < uploadInfo.files.length; inx++) {
        const file = uploadInfo.files;

        const s3FileInfo: S3FileInfo = {
          id: file[inx].name,
          name: file[inx].name,
          type: file[inx].type,
          size: file[inx].size,
          src: {
            file: file[inx],
          },
        };

        if (result?.data) {
          const uploadResult = await s3ServiceInstance.s3FileUpload(result.data.presignedUrlFiles[inx], s3FileInfo);
          if (!uploadResult) {
            return '';
          }
        }
      }
    } else {
      return '';
    }

    return signedUrlList;
  }
}

export const fileServiceInstance = new FileService();
