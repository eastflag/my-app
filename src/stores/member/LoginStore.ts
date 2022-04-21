import { t } from 'i18next';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { loginServiceInstance } from '../../services/member/LoginService';
import { LoginErrorType, LoginSuccessResponse, SnsResponseType } from '../../services/member/model/Login';
import BaseStore from '../BaseStore';
import SessionStore from '../common/SessionStore';
import RootStore from '../Store';

export interface ErrorStatus {
  message: string;
  view: boolean;
}

export interface NavigationAdditionalInfo {
  emailAddress?: string;
  sequenceNumber?: string;
  twoFactor?: string[];
}
export interface NavigationInfo {
  to?: string;
  additionalInfo?: NavigationAdditionalInfo;
  error?: string;
}

export interface LoginInfo {
  emailAddress: string;
  password: string;
  captchaKey: string;
}

export interface SnsLoginQueryResponse {
  idToken?: string;
  emailAddress?: string;
  type?: string;
  sequenceNumber?: string;
  twoFactor?: string;
  twoFactorEmail?: string;
  twoFactorPhone?: string;
}

export class LoginStore extends BaseStore {
  emailAddress: string = '';
  password: string = '';
  loginType: string = '';
  captchaKey: string = '';
  isVisiblePassword: boolean = false;
  isCapsLockOn: boolean = false;
  canCaptchaReset: boolean = false;
  sessionStore: SessionStore;

  errorAlert: ErrorStatus = {
    view: false,
    message: '',
  };

  constructor(root: RootStore) {
    super(root);
    this.sessionStore = root.sessionStore;
    makeObservable(this, {
      emailAddress: observable,
      password: observable,
      errorAlert: observable,
      isVisiblePassword: observable,
      isCapsLockOn: observable,
      canCaptchaReset: observable,
      setEmailAddress: action,
      setPassword: action,
      setErrorAlert: action,
      setVisiblePassword: action,
      setCapsLockOn: action,
      setLoginInfo: action,
      resetCaptcha: action,
      cleanUp: action,
    });
  }

  cleanUp() {
    this.setLoginInfo({ password: '', emailAddress: '', captchaKey: '' });
    this.setErrorAlert({ message: '', view: false });
    this.setVisiblePassword(false);
  }

  resetCaptcha(captchReset: boolean) {
    this.canCaptchaReset = captchReset;
  }

  setEmailAddress(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setCaptchaKey(captchaKey: string) {
    this.captchaKey = captchaKey;
  }

  setErrorAlert(errorAlertStatus: ErrorStatus) {
    this.errorAlert = errorAlertStatus;
  }

  setVisiblePassword(showPassword: boolean) {
    this.isVisiblePassword = showPassword;
  }

  setCapsLockOn(onCapsLock: boolean) {
    this.isCapsLockOn = onCapsLock;
  }

  setLoginInfo(logInInfo: LoginInfo) {
    this.emailAddress = logInInfo.emailAddress;
    this.password = logInInfo.password;
    this.captchaKey = logInInfo.captchaKey;
  }

  async requestLogin() {
    const navigationInfo: NavigationInfo = {};
    this.setErrorAlert({ message: '', view: false });
    try {
      const result = await this.callApiWithState<BeApiResponse<LoginSuccessResponse>>(
        loginServiceInstance.requestLogin,
        {
          emailAddress: this.emailAddress,
          captchaKey: this.captchaKey,
          password: this.password,
        }
      );

      if (result?.successOrNot === 'Y' && result?.data) {
        if (result.data.twoFactor) {
          navigationInfo.additionalInfo = {
            twoFactor: result.data.twoFactor,
          };
        } else if (result.data.idToken) {
          this.root?.sessionStore.setIdToken(result.data.idToken);
          navigationInfo.to = '/main';
        } else {
          navigationInfo.error = 'error ocurrs.';
        }
      } else {
        navigationInfo.error = 'error ocurrs.';
      }
    } catch (error: unknown) {
      const errorStatus: ErrorStatus = {
        view: false,
        message: '',
      };
      const checkError: BeApiResponse<string> = error as BeApiResponse<string>;
      switch (checkError.statusCode) {
        case LoginErrorType.INVALID_MEMBER_INFORMATION:
          errorStatus.view = true;
          errorStatus.message = t('member:login.errorMessage.incorrectLoginInfo');
          break;
        case LoginErrorType.INVALID_CAPTCHA:
          errorStatus.view = true;
          errorStatus.message = t('member:login.errorMessage.invalidReCAptcha');
          break;
        case LoginErrorType.LOGIN_ATTEMPT_EXCEED:
          errorStatus.view = true;
          errorStatus.message = t('member:login.errorMessage.lockAccount');
          break;
        case LoginErrorType.INVALID_MEMBER_TYPE:
          navigationInfo.to = '/signUp';
          break;
        default:
          navigationInfo.error = checkError.data;
          break;
      }
      this.setCaptchaKey('');
      this.setErrorAlert(errorStatus);
    }
    return navigationInfo;
  }

  getNavigationInfoWithSnsRequest(queryParams: SnsLoginQueryResponse) {
    const navigationInfo: NavigationInfo = {};

    switch (queryParams.type) {
      case SnsResponseType.INTEGRATE:
        if (queryParams.idToken) {
          this.root?.sessionStore.setIdToken(queryParams.idToken);
        }
        navigationInfo.additionalInfo = {
          emailAddress: queryParams.emailAddress,
          sequenceNumber: queryParams.sequenceNumber,
        };
        navigationInfo.to = '/signUp/integrate';
        break;
      case SnsResponseType.SIGNUP:
        navigationInfo.additionalInfo = {
          emailAddress: queryParams.emailAddress,
        };
        navigationInfo.to = '/signUp/sns';
        break;
      case SnsResponseType.SIGNIN:
        if (queryParams.idToken) {
          this.root?.sessionStore.setIdToken(queryParams.idToken);
        }
        navigationInfo.to = '/main';
        break;
      default:
        break;
    }

    return navigationInfo;
  }
}

export default LoginStore;
