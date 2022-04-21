import * as CommonToast from '../../components/common/CommonToast';
import { StatusCode } from '../../services/common/model/Error';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { integrateServiceInstance } from '../../services/member/IntegrateService';
import { loginServiceInstance } from '../../services/member/LoginService';
import { LoginErrorType, LoginSuccessResponse } from '../../services/member/model/Login';
import { SendEmailResult } from '../../services/member/model/SendEmailResultModel';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import RootStore from '../Store';
import { ProcessType, SendType, SignUpType, TwoFactorResultType, UseType, VerificationType } from './model/memberModel';

const rootStore = new RootStore();

jest.mock('../../components/common/CommonToast');
const mockedCommonToast = CommonToast as jest.Mocked<typeof CommonToast>;

jest.mock('../../services/member/LoginService.ts');
const mockedApiLoginServiceInstance = loginServiceInstance as jest.Mocked<typeof loginServiceInstance>;

jest.mock('../../services/member/RecoveryPasswordService.ts');
const mockedRecoveryPasswordServiceInstance = recoveryPasswordServiceInstance as jest.Mocked<
  typeof recoveryPasswordServiceInstance
>;

jest.mock('../../services/member/IntegrateService');
const mockIntegrateServiceInstance = integrateServiceInstance as jest.Mocked<typeof integrateServiceInstance>;

describe('LoginComposedStore 테스트', () => {
  const { loginComposedStore } = rootStore;

  describe('LoginComposedStore set, get테스트', () => {
    it('cleanUp 호출', () => {
      loginComposedStore.cleanUp();
      expect(loginComposedStore.emailAddress).toBe('');
    });

    it('getStep,setStep 호출', () => {
      const step = 0;
      loginComposedStore.setStep(0);

      expect(loginComposedStore.step).toBe(0);
    });

    it('toNextStep 한번 호출', () => {
      loginComposedStore.toNextStep();

      expect(loginComposedStore.step).toEqual(1);
    });

    it('toNextStep 여러번 호출', () => {
      loginComposedStore.toNextStep();
      loginComposedStore.toNextStep();
      loginComposedStore.toNextStep();
      loginComposedStore.toNextStep();
      loginComposedStore.toNextStep();

      expect(loginComposedStore.step).toEqual(6);
    });

    it('toNextStep setStep 이후 호출', () => {
      loginComposedStore.setStep(5);
      loginComposedStore.toNextStep();

      expect(loginComposedStore.step).toEqual(6);
    });

    it('toNextStep setStep 이전 호출', () => {
      loginComposedStore.toNextStep();
      loginComposedStore.setStep(5);

      expect(loginComposedStore.step).toEqual(5);
    });

    it('현재 step이 NaN일 시 toNextStep 호출', () => {
      loginComposedStore.setStep(NaN);
      loginComposedStore.toNextStep();

      expect(loginComposedStore.step).toEqual(0);
    });

    it('getEmailAddress, setEmailAddress 호출', () => {
      const emailAddress = 'testId@naemo.io';
      loginComposedStore.setEmailAddress(emailAddress);

      expect(loginComposedStore.emailAddress).toBe(emailAddress);
    });

    it('getPassword, setPassword 호출', () => {
      const password = 'testId@naemo.io';
      loginComposedStore.setPassword(password);

      expect(loginComposedStore.password).toBe(password);
    });

    it('getProcessType, setProcessType 호출', () => {
      const processType = ProcessType.SIGN_IN;
      loginComposedStore.setProcessType(ProcessType.SIGN_IN);

      expect(loginComposedStore.processType).toBe(processType);
    });

    it('getSignUpType, setSignUpType 호출', () => {
      const signUpType = SignUpType.ID;
      loginComposedStore.setSignUpType(signUpType);

      expect(loginComposedStore.signUpType).toBe(signUpType);
    });

    it('getVerificationNumber, setVerificationNumber 호출', () => {
      const verificationNumber = '123456';
      loginComposedStore.setVerificationNumber(verificationNumber);

      expect(loginComposedStore.verificationNumber).toBe(verificationNumber);
    });

    it('getSequenceNumber, setSequenceNumber 호출', () => {
      const sequenceNumber = [123456, 456789];
      loginComposedStore.setSequenceNumber(123456);
      loginComposedStore.setSequenceNumber(456789);

      expect(loginComposedStore.sequenceNumber).toStrictEqual(sequenceNumber);
    });

    it('getTwoFactor, setTwoFactor 호출', () => {
      const twoFactor = ['EMAIL', 'PHONE'];
      loginComposedStore.setTwoFactorList(twoFactor);

      expect(loginComposedStore.twoFactorList).toStrictEqual(twoFactor);
    });

    it('getVerificationType, setVerificationType 호출', () => {
      const verificationType = VerificationType.EMAIL;
      loginComposedStore.setVerificationType(verificationType);

      expect(loginComposedStore.verificationType).toBe(verificationType);
    });

    it('getProgressBar, setProgressBar 호출', () => {
      const progressBar = 30;
      loginComposedStore.setProgressBar(progressBar);

      expect(loginComposedStore.progressBar).toBe(progressBar);
    });
  });

  describe('twoFactorLogin() 테스트 - Two Factor 로그인', () => {
    const mockTwoFactorLoginInfo = {
      emailAddress: 'twoFactorTest@naemo.ui',
      password: '123456',
      sequenceNumber: [100, 101],
      twoFactor: ['EMAIL', 'PHONE'],
      signUpType: 'ID',
    };

    let mockApiResponse: BeApiResponse<LoginSuccessResponse> = {
      successOrNot: 'Y',
      statusCode: StatusCode.SUCCESS,
      data: {
        idToken: '32905809217',
      },
    };

    it('two factor 로그인 성공 시, result 값 true 반환', async () => {
      mockedApiLoginServiceInstance.requestTwoFactorLogin.mockResolvedValue(mockApiResponse);
      const result = await loginComposedStore.twoFactorLogin();
      expect(result).toEqual(true);
    });

    it('two factor 로그인 실패 시, error 토스트 호출', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: LoginErrorType.INVALID_MEMBER_INFORMATION,
      };

      mockedApiLoginServiceInstance.requestTwoFactorLogin.mockRejectedValue(mockApiResponse);
      const result = await loginComposedStore.twoFactorLogin();
      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('two factor 로그인 실패 시, result 값 false 반환', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: LoginErrorType.INVALID_MEMBER_INFORMATION,
      };

      mockedApiLoginServiceInstance.requestTwoFactorLogin.mockRejectedValue(mockApiResponse);
      const result = await loginComposedStore.twoFactorLogin();
      expect(result).toEqual(false);
    });
  });

  describe('sendEmailVerification() 테스트', () => {
    const mockSendEmailVerification = {
      useType: UseType.SIGN_IN,
      sendType: SendType.SEND,
      sendTarget: 'emailSendTest@naemo.ui',
      verificationType: VerificationType.EMAIL,
    };

    let mockApiResponse: BeApiResponse<SendEmailResult> = {
      successOrNot: 'Y',
      statusCode: StatusCode.SUCCESS,
      data: {
        reSendCount: 0,
        reSendCountLimit: 0,
      },
    };

    it('verification mail/phone 전송 성공 시, true 반환', async () => {
      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockResolvedValue(mockApiResponse);
      const result = await loginComposedStore.sendVerification();
      expect(result).toEqual(true);
    });

    it('verification mail/phone 전송 실패 시, false 반환', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.NO_HAVE_SEND_DATA,
      };

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await loginComposedStore.sendVerification();
      expect(result).toEqual(false);
    });

    it('MANDATORY_PARAM_ERR으로 verification mail/phone 전송 실패 시, error 토스트 호출', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: 'MANDATORY_PARAM_ERR',
      };

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await loginComposedStore.sendVerification();
      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('INVALID_FORMAT으로 verification mail/phone 전송 실패 시, error 토스트 호출', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: 'INVALID_FORMAT',
      };

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await loginComposedStore.sendVerification();
      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('INVALID_PARAMETER으로 verification mail/phone 전송 실패 시, error 토스트 호출', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: 'INVALID_PARAMETER',
      };

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await loginComposedStore.sendVerification();
      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('NO_HAVE_SEND_DATA로 verification mail/phone 전송 실패 시, error 토스트 호출', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: 'NO_HAVE_SEND_DATA',
      };

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await loginComposedStore.sendVerification();
      expect(mockedCommonToast.showToast).toBeCalled();
    });
  });

  describe('processTwoFactorSignIn() 테스트', () => {
    const mockTwoFactorLoginInfo = {
      emailAddress: 'twoFactorTest@naemo.ui',
      password: '123456',
      sequenceNumber: [100, 101],
      twoFactorList: ['EMAIL', 'PHONE'],
      signUpType: 'ID',
    };
    const mockApiResponse: BeApiResponse<LoginSuccessResponse> = {
      successOrNot: 'Y',
      statusCode: StatusCode.SUCCESS,
      data: {
        idToken: '32905809217',
      },
    };

    it('two factor 인증을 모두 성공 시, COMPLETE 반환', async () => {
      mockedApiLoginServiceInstance.requestTwoFactorLogin.mockResolvedValue(mockApiResponse);

      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE']);
      loginComposedStore.setStep(2);

      const result = await loginComposedStore.processTwoFactorSignIn();

      expect(result).toBe(TwoFactorResultType.COMPLETE);
    });

    it('two factor 인증 완료 전 INCOMPLETE 반환', async () => {
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE']);
      loginComposedStore.setStep(0);
      const result = await loginComposedStore.processTwoFactorSignIn();

      expect(result).toBe(TwoFactorResultType.INCOMPLETE);
    });

    it('email two factor 인증 시 verificationType 정상 설정', async () => {
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE']);
      loginComposedStore.setStep(0);
      loginComposedStore.processTwoFactorSignIn();

      expect(loginComposedStore.verificationType).toBe('EMAIL');
    });

    it('phone two factor 인증 시 verificationType 정상 설정', async () => {
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE']);
      loginComposedStore.setStep(1);
      loginComposedStore.processTwoFactorSignIn();

      expect(loginComposedStore.verificationType).toBe('PHONE');
    });

    it('2번의 two factor 인증 시 현재 step이 0일 경우 progressBar의 길이 50 설정', async () => {
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE']);
      loginComposedStore.setStep(0);
      await loginComposedStore.processTwoFactorSignIn();
      expect(loginComposedStore.progressBar).toBe(50);
    });

    it('2번의 two factor 인증 시 현재 step이 1일 경우 progressBar의 길이 100 설정', async () => {
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE']);
      loginComposedStore.setStep(1);
      await loginComposedStore.processTwoFactorSignIn();
      expect(loginComposedStore.progressBar).toBe(100);
    });

    it('3번의 two factor 인증 시 현재 step이 0일 경우 progressBar의 길이 33.3 설정', async () => {
      loginComposedStore.setProgressBar(0);
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE', 'OTP']);
      loginComposedStore.setStep(0);
      await loginComposedStore.processTwoFactorSignIn();
      expect(loginComposedStore.progressBar).toBe(33.3);
    });

    it('3번의 two factor 인증 시 현재 step이 0일 경우 progressBar의 길이 66.6 설정', async () => {
      loginComposedStore.setProgressBar(0);
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE', 'OTP']);
      loginComposedStore.setStep(1);
      await loginComposedStore.processTwoFactorSignIn();
      expect(loginComposedStore.progressBar).toBe(66.6);
    });

    it('3번의 two factor 인증 시 현재 step이 0일 경우 progressBar의 길이 100 설정', async () => {
      loginComposedStore.setProgressBar(0);
      loginComposedStore.setTwoFactorList(['EMAIL', 'PHONE', 'OTP']);
      loginComposedStore.setStep(2);
      await loginComposedStore.processTwoFactorSignIn();
      expect(loginComposedStore.progressBar).toBe(100);
    });
  });

  describe('integrateMember() 톄스트', () => {
    beforeEach(() => {
      loginComposedStore.setEmailAddress('a@a.com');
      loginComposedStore.setSnsLoginSequenceNumber('123');
    });

    it('error case should set integrateComplete false', async () => {
      const mockApiResponse = { successOrNot: 'N', statusCode: 'MANDATORY_PARAM_ERR' };
      mockIntegrateServiceInstance.integrateMember.mockResolvedValue(mockApiResponse);
      const currentStep = 0;
      loginComposedStore.setStep(currentStep);

      await loginComposedStore.integrateMember();

      expect(loginComposedStore.integrateComplete).toEqual(false);
    });

    it('error case should not change step', async () => {
      const mockApiResponse = { successOrNot: 'N', statusCode: 'MANDATORY_PARAM_ERR' };
      mockIntegrateServiceInstance.integrateMember.mockResolvedValue(mockApiResponse);
      const currentStep = 0;
      loginComposedStore.setStep(currentStep);

      await loginComposedStore.integrateMember();

      expect(loginComposedStore.step).toEqual(currentStep);
    });

    it('error case should show toast', async () => {
      const mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_MEMBER_INFORMATION' };
      mockIntegrateServiceInstance.integrateMember.mockRejectedValue(mockApiResponse);

      await loginComposedStore.integrateMember();

      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('success case should set integrateComplete true', async () => {
      const mockApiResponse = {
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: {
          idToken: 'thisIsIdToken',
        },
      };
      mockIntegrateServiceInstance.integrateMember.mockResolvedValue(mockApiResponse);

      await loginComposedStore.integrateMember();

      expect(loginComposedStore.integrateComplete).toEqual(true);
    });
  });
});
