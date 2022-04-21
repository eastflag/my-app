import { CommonCode } from '../../stores/common/CommonCodesStore';
import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { CommonCodeRequest, CommonCodeResponse } from './model/CommonCode';
class CommonCodeService extends BaseService {
  public getCommonCode = async (commonCodeRequest: CommonCodeRequest) => {
    const beApiRequest: BeApiRequest = {
      method: Method.GET,
      url: `/marketplace/v1/commonCodes/${commonCodeRequest.groupCodeId}`,
      serviceName: Service.MARKETPLACE,
    };
    const result: BeApiResponse<CommonCodeResponse[]> = await this.fnRest(beApiRequest);

    return result;
  };

  public getCommonCodes = async (codeIdList: string[]) => {
    const beApiRequest: BeApiRequest = {
      method: Method.GET,
      url: `/marketplace/v1/commonCodes`,
      serviceName: Service.MARKETPLACE,
      params: {
        queryParams: codeIdList,
      },
    };
    const result: BeApiResponse<CommonCode> = await this.fnRest(beApiRequest);

    return result;
  };
}

export const commonCodeServiceInstance = new CommonCodeService();
