import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { VerificationResult } from './model/VerificationResultModel';

class VerificationService extends BaseService {
  public checkVerificationNumber = async (body: object) => {
    const beApiRequest: BeApiRequest = {
      method: Method.PUT,
      url: `/marketplace/v1/member/emailVerification`,
      serviceName: Service.MARKETPLACE,
      params: { bodyParams: body },
    };
    const result: BeApiResponse<VerificationResult> = await this.fnRest(beApiRequest);
    return result;
  };
}

export const verificationServiceInstance = new VerificationService();
