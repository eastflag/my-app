import BaseService from '../common/BaseService';
import { StatusCode } from '../common/model/Error';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { Login, TwoFactorLogin, LoginSuccessResponse } from './model/Login';

class LoginService extends BaseService {
  public requestLogin = async (request: Login) => {
    const beApiRequest: BeApiRequest = {
      method: Method.POST,
      url: `/marketplace/v1/member/session`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: request,
      },
    };

    const result: BeApiResponse<LoginSuccessResponse> = await this.fnRest(beApiRequest);

    return result;
  };
  public requestTwoFactorLogin = async (request: TwoFactorLogin) => {
    const beApiRequest: BeApiRequest = {
      method: Method.POST,
      url: `/marketplace/v1/member/twoFactor`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: request,
      },
    };

    const result: BeApiResponse<LoginSuccessResponse> = await this.fnRest(beApiRequest);

    return result;
  };
}

export const loginServiceInstance = new LoginService();
