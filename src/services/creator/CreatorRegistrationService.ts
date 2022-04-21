import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { CreatorRegistrationRequest } from './model/CreatorRegistration';

class CreatorRegistrationService extends BaseService {
  public registerCreator = async (request: CreatorRegistrationRequest) => {
    const beApiRequest: BeApiRequest = {
      method: Method.POST,
      url: `/marketplace/v1/creator/registrations`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: request,
      },
    };

    const result: BeApiResponse<string | object> = await this.fnRest(beApiRequest);

    return result;
  };
}

export const creatorRegistrationServiceInstance = new CreatorRegistrationService();
