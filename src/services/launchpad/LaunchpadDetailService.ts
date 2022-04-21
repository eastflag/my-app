import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { LaunchpadDetail } from './model/launchpadModel';

class LaunchpadDetailService extends BaseService {
  public fetchLaunchpadDetail = async (launchpadId: number) => {
    const beApiRequest: BeApiRequest = {
      method: Method.GET,
      url: `/marketplace/v1/launchpads/${launchpadId}`,
      serviceName: Service.MARKETPLACE,
    };
    const result: BeApiResponse<LaunchpadDetail> = await this.fnRest(beApiRequest);
    return result;
  };
}

export const launchpadDetailServiceInstance = new LaunchpadDetailService();
