import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { Integrate, IntegateSuccessResponse } from './model/IntegrateMember';

class IntegrateService extends BaseService {
  public integrateMember = async (request: Integrate) => {
    const beApiRequest: BeApiRequest = {
      method: Method.POST,
      url: `/marketplace/v1/member/integration`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: request,
      },
    };
    const result: BeApiResponse<IntegateSuccessResponse> = await this.fnRest(beApiRequest);

    return result;
  };
}

export const integrateServiceInstance = new IntegrateService();
