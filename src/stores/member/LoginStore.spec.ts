import { BeApiResponse } from '../../services/common/model/RestApi';
import { loginServiceInstance } from '../../services/member/LoginService';
import { LoginErrorType, LoginSuccessResponse, SnsResponseType } from '../../services/member/model/Login';
import RootStore from '../Store';
import { ErrorStatus, LoginInfo, NavigationInfo, SnsLoginQueryResponse } from './LoginStore';

const rootStore = new RootStore();

jest.mock('../../services/member/LoginService.ts');
const mockedApi = loginServiceInstance as jest.Mocked<typeof loginServiceInstance>;

describe('LoginStore 테스트', () => {
  const { loginStore } = rootStore;

  describe('requestLogin() 테스트 - ID/PW 로그인', () => {
    const mockLoginInfo: LoginInfo = {
      emailAddress: 'yooncheol14@lgcns.com',
      password: '123123',
      captchaKey: 'captchaKey',
    };

    let mockApiResponse: BeApiResponse<LoginSuccessResponse> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
      data: {
        idToken: '987987123',
      },
    };

    it('로그인 성공시, 홈 이동 정보 정상 반환', async () => {
      loginStore.setLoginInfo(mockLoginInfo);
      mockedApi.requestLogin.mockResolvedValue(mockApiResponse);
      const result: NavigationInfo = await loginStore.requestLogin();

      expect(result.to).toEqual('/main');
    });

    it('로그인 실패 - 계정 정보 불일치 시, errorAlert 확인', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: LoginErrorType.INVALID_MEMBER_INFORMATION,
      };

      mockedApi.requestLogin.mockRejectedValue(mockApiResponse);
      await loginStore.requestLogin();
      expect(loginStore.errorAlert.view).toBe(true);
    });

    it('로그인 실패 - 리캡챠 실패 시, errorAlert 확인', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: LoginErrorType.INVALID_CAPTCHA,
      };

      mockedApi.requestLogin.mockRejectedValue(mockApiResponse);
      await loginStore.requestLogin();
      expect(loginStore.errorAlert.view).toBe(true);
    });

    it('로그인 실패 - 로그인 시도 횟수 초과 시, errorAlert 확인', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: LoginErrorType.LOGIN_ATTEMPT_EXCEED,
      };

      mockedApi.requestLogin.mockRejectedValue(mockApiResponse);
      await loginStore.requestLogin();
      expect(loginStore.errorAlert.view).toBe(true);
    });

    it('로그인 실패 - member type 불일치 시, errorAlert 확인', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: LoginErrorType.INVALID_MEMBER_TYPE,
      };

      mockedApi.requestLogin.mockRejectedValue(mockApiResponse);

      const result = await loginStore.requestLogin();
      expect(result.to).toBe('/signUp');
    });

    it('정의 되지 않은 에러 statusCode가 리턴되었을 경우, navigationInfo 확인', async () => {
      const mockErrorResponse: BeApiResponse<string> = {
        successOrNot: 'N',
        statusCode: 'UNKNOWN_ERROR',
        data: 'unknown error',
      };

      mockedApi.requestLogin.mockRejectedValue(mockErrorResponse);
      const result = await loginStore.requestLogin();
      expect(result.to).toBeFalsy();
      expect(result.additionalInfo).toBeFalsy();
      expect(result.error).toBe(mockErrorResponse.data);
    });

    it('successOrNot이 존재하지 않거나, data가 없는 경우 error occurs.', async () => {
      const mockResponse: BeApiResponse<LoginSuccessResponse> = {
        successOrNot: 'N',
        statusCode: 'UNKNOWN_ERROR',
      };

      mockedApi.requestLogin.mockResolvedValue(mockResponse);
      const result = await loginStore.requestLogin();
      expect(result.error).not.toBeFalsy();
    });

    it('twoFactor 설정이 되어있을 경우 additionalInfo에 twoFactor 정보 확인', async () => {
      mockApiResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: {
          twoFactor: ['EMAIL', 'PHONE'],
        },
      };

      loginStore.setLoginInfo(mockLoginInfo);
      mockedApi.requestLogin.mockResolvedValue(mockApiResponse);
      const result: NavigationInfo = await loginStore.requestLogin();

      expect(result.additionalInfo?.twoFactor).toEqual(['EMAIL', 'PHONE']);
    });
  });

  describe('getNavigationInfoWithSnsRequest() 테스트 - sns 로그인 정보로 navigation 정보 get', () => {
    const mockQueryParms: SnsLoginQueryResponse = {
      emailAddress: 'yooncheol14',
      idToken: 'idToken',
      sequenceNumber: '123',
    };

    it('type이 INTEGRATE일 경우, emailAddress,sequenceNumber, to를 return', () => {
      mockQueryParms.type = SnsResponseType.INTEGRATE;
      const result = loginStore.getNavigationInfoWithSnsRequest(mockQueryParms);

      expect(result.additionalInfo).toEqual({ emailAddress: 'yooncheol14', sequenceNumber: '123' });
      expect(result.to).toBe('/signUp/integrate');
    });

    it('type이 SIGNUP일 경우, emailAddress, to를 return', () => {
      mockQueryParms.type = SnsResponseType.SIGNUP;

      const result = loginStore.getNavigationInfoWithSnsRequest(mockQueryParms);

      expect(result.additionalInfo).toEqual({ emailAddress: 'yooncheol14' });
      expect(result.to).toBe('/signUp/sns');
    });

    it('type이 SIGNIN일 경우, to를 return', () => {
      mockQueryParms.type = SnsResponseType.SIGNIN;

      const result = loginStore.getNavigationInfoWithSnsRequest(mockQueryParms);

      expect(result.to).toBe('/main');
    });

    it('type이 없는 경우, 빈 navigationInfo return', () => {
      mockQueryParms.type = undefined;
      const result = loginStore.getNavigationInfoWithSnsRequest(mockQueryParms);

      expect(result.additionalInfo).toBeUndefined();
      expect(result.to).toBeUndefined();
    });
  });

  it('setEmailAddress() called', () => {
    const emailAddress = 'yooncheol14@lgcns.com';
    loginStore.setEmailAddress('yooncheol14@lgcns.com');
    expect(loginStore.emailAddress).toBe(emailAddress);
  });

  it('setPassword() called', () => {
    const password = '123123';
    loginStore.setPassword(password);
    expect(loginStore.password).toBe(password);
  });

  it('setErrorAlert() called', () => {
    const newErrorAlert: ErrorStatus = {
      view: true,
      message: '',
    };
    loginStore.setErrorAlert(newErrorAlert);
    expect(loginStore.errorAlert).toEqual(newErrorAlert);
  });

  it('setVisiblePassword() called', () => {
    const showPassword = true;
    loginStore.setVisiblePassword(showPassword);
    expect(loginStore.isVisiblePassword).toBe(showPassword);
  });

  it('setCapsLockOn() called', () => {
    const capsLockOn = true;
    loginStore.setCapsLockOn(capsLockOn);
    expect(loginStore.isCapsLockOn).toBe(capsLockOn);
  });

  it('setLoginInfo() called', () => {
    const loginInfo: LoginInfo = {
      emailAddress: 'yooncheol14@lgcns.com',
      password: '123123',
      captchaKey: 'captchaKey',
    };
    loginStore.setLoginInfo(loginInfo);
    expect(loginStore.emailAddress).toBe(loginInfo.emailAddress);
    expect(loginStore.password).toBe(loginInfo.password);
    expect(loginStore.captchaKey).toBe(loginInfo.captchaKey);
  });

  it('resetCaptcha() called', () => {
    loginStore.resetCaptcha(false);
    expect(loginStore.canCaptchaReset).toBe(false);
  });

  it('cleanUp() called', () => {
    loginStore.cleanUp();
    expect(loginStore.password).toBe('');
    expect(loginStore.emailAddress).toBe('');
    expect(loginStore.captchaKey).toBe('');
    expect(loginStore.errorAlert.message).toEqual('');
    expect(loginStore.errorAlert.view).toBe(false);
    expect(loginStore.isVisiblePassword).toBe(false);
  });
});
