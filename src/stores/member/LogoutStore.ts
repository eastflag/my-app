import { sessionStorageServiceInstance } from '../../services/common/SessionStorageService';
import { logoutServiceInstance } from '../../services/member/LogoutService';
import BaseStore from '../BaseStore';

export class LogoutStore extends BaseStore {
  async requestLogout() {
    try {
      /* TODO Session 인증 FE/BE 개발 이후 헤더 값으로 변경
              관련 Jira - https://aon.atlassian.net/jira/software/projects/AON/boards/3/backlog?selectedIssue=AON-309*/
      const idToken = sessionStorageServiceInstance.getIdToken();
      if (!idToken) {
        return false;
      } else {
        await logoutServiceInstance.requestLogout({
          idToken: idToken,
        });
        this.root?.sessionStore.deleteIdToken();
        return true;
      }
    } catch (err: unknown) {
      return false;
    }
  }
}

export default LogoutStore;
