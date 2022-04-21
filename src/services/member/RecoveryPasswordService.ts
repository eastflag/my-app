import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { SendEmailResult } from './model/SendEmailResultModel';

class RecoveryPasswordService extends BaseService {
  public sendEmailVerification = async (body: object) => {
    const beApiRequest: BeApiRequest = {
      method: Method.POST,
      url: `/marketplace/v1/member/emailVerification`,
      serviceName: Service.MARKETPLACE,
      params: { bodyParams: body },
    };
    const result: BeApiResponse<SendEmailResult> = await this.fnRest(beApiRequest);
    return result;
  };
}

export const recoveryPasswordServiceInstance = new RecoveryPasswordService();
