import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { Logout } from './model/Logout';

class LogoutService extends BaseService {
  public requestLogout = async (logoutRequest: Logout) => {
    const beApiRequest: BeApiRequest = {
      method: Method.DELETE,
      url: `/marketplace/v1/member/session`,
      serviceName: Service.MARKETPLACE,
      /* TODO Session 인증 FE/BE 개발 이후 헤더 값으로 변경
              관련 Jira - https://aon.atlassian.net/jira/software/projects/AON/boards/3/backlog?selectedIssue=AON-309*/
      params: {
        bodyParams: logoutRequest,
      },
    };

    const result: BeApiResponse<void> = await this.fnRest(beApiRequest);

    return result;
  };
}

export const logoutServiceInstance = new LogoutService();
