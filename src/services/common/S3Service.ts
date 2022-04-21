import axios, { AxiosRequestConfig, Method } from 'axios';
import { S3FileInfo, PresignedUrlFile } from './model/File';

class S3Service {
  private config: AxiosRequestConfig = {};

  async s3FileUpload(presignedInfo: PresignedUrlFile, file: S3FileInfo): Promise<boolean> {
    const method: Method = 'PUT';
    const url = presignedInfo.preSignedUrl;
    const params = null;
    const body = file.src.file;
    const header = {
      'Content-Type': file.src.file.type,
    };

    let result = false;
    try {
      const response = await this.fnRest(method, url, header, params, body);

      if (response.status === 200) {
        result = true;
      }

      console.log(result);
    } catch (error) {
      result = false;
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async fnRest(method: Method, url: string, header: any, params?: any, requestBody?: any): Promise<any> {
    this.config.method = method;
    this.config.url = url;
    this.config.headers = header;
    if (params) {
      this.config.params = params;
    }
    if (requestBody) {
      this.config.data = requestBody;
    }

    return await axios.request(this.config);
  }
}

export const s3ServiceInstance = new S3Service();
