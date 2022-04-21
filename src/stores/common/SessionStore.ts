import { action, makeObservable, observable } from 'mobx';
import { sessionStorageServiceInstance } from '../../services/common/SessionStorageService';
import BaseStore from '../BaseStore';
import RootStore from '../Store';

export enum TokenExtractKey {
  MEMBER_ID = 'cognito:username',
  MEMBER_EMAILADDRESS = 'email',
  NICKNAME = 'nickname',
}

class SessionStore extends BaseStore {
  isLogged: boolean = false;
  memberId: string = '';
  memberEmailAddress: string = '';
  nickname: string = '';

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      isLogged: observable,
      memberId: observable,
      memberEmailAddress: observable,
      nickname: observable,
      init: action,
      cleanUp: action,
    });
  }

  init() {
    const idToken = sessionStorageServiceInstance.getIdToken();
    if (idToken) {
      this.setMemberInfoFromToken(idToken);
    } else {
      this.cleanUp();
    }
  }

  cleanUp() {
    this.isLogged = false;
    this.memberId = '';
    this.memberEmailAddress = '';
    this.nickname = '';
  }

  setMemberInfoFromToken = (idToken: string) => {
    const payload: string | undefined = idToken.split('.')[1];

    if (payload) {
      const decodeResult = window.atob(payload);
      const objectResult = JSON.parse(decodeResult);
      this.isLogged = true;
      this.memberId = objectResult[TokenExtractKey.MEMBER_ID];
      this.memberEmailAddress = objectResult[TokenExtractKey.MEMBER_EMAILADDRESS];
      this.nickname = objectResult[TokenExtractKey.NICKNAME];
    } else {
      this.cleanUp();
    }
  };

  setIdToken(idToken: string) {
    sessionStorageServiceInstance.setIdToken(idToken);
    this.init();
  }

  deleteIdToken() {
    sessionStorageServiceInstance.deleteIdToken();
    this.init();
  }
}

export default SessionStore;
