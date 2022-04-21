import {
  SetPasswordRequest,
  MemberUnlockRequest,
  SignUpRequest,
  MemberUnlockHashValidateRequest,
} from '../../stores/member/model/memberModel';
import BaseService from '../common/BaseService';

import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { SetPasswordResponse, SignUpResponse, ValidateMemberUnlockHashResponse } from './model/SetPassword';

class MemberService extends BaseService {
  public signUp = async (signUpRequest: SignUpRequest) => {
    const beApiRequest: BeApiRequest = {
      method: Method.POST,
      url: `/marketplace/v1/member`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: signUpRequest,
      },
    };
    const result: BeApiResponse<SignUpResponse> = await this.fnRest(beApiRequest);
    return result;
  };

  public setPassword = async (setPasswordRequest: SetPasswordRequest) => {
    const beApiRequest: BeApiRequest = {
      method: Method.PUT,
      url: `/marketplace/v1/member/password`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: setPasswordRequest,
      },
    };
    const result: BeApiResponse<SetPasswordResponse> = await this.fnRest(beApiRequest);
    return result;
  };

  public unlockMember = async (memberUnlockRequest: MemberUnlockRequest) => {
    const beApiRequest: BeApiRequest = {
      method: Method.PUT,
      url: `/marketplace/v1/member/unlock`,
      serviceName: Service.MARKETPLACE,
      params: {
        bodyParams: memberUnlockRequest,
      },
    };
    const result: BeApiResponse<SetPasswordResponse> = await this.fnRest(beApiRequest);
    return result;
  };

  public validateMemberUnlockHash = async (memberUnlockHashValidateRequest: MemberUnlockHashValidateRequest) => {
    const beApiRequest: BeApiRequest = {
      method: Method.GET,
      url: `/marketplace/v1/member/unlock`,
      serviceName: Service.MARKETPLACE,
      params: {
        queryParams: memberUnlockHashValidateRequest,
      },
    };
    const result: BeApiResponse<ValidateMemberUnlockHashResponse> = await this.fnRest(beApiRequest);
    return result;
  };
}

export const memberServiceInstance = new MemberService();
