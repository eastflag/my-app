import { ServiceTerm } from '../../stores/terms/TermStore';
import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { Service } from '../common/model/Service';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';

class TermService extends BaseService {
  public fetchTerms = async () => {
    const beApiRequest: BeApiRequest = {
      method: Method.GET,
      url: `/marketplace/v1/serviceTerms`,
      serviceName: Service.MARKETPLACE,
    };
    const result: BeApiResponse<ServiceTerm[]> = await this.fnRest(beApiRequest);
    return result;
  };
}

export const termServiceInstance = new TermService();
