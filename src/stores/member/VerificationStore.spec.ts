import { t } from 'i18next';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { SendEmailResult } from '../../services/member/model/SendEmailResultModel';
import { VerificationResult } from '../../services/member/model/VerificationResultModel';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import { verificationServiceInstance } from '../../services/member/VerificationService';
import RootStore from '../Store';
import { ProcessType, SignUpType, UseType } from './model/memberModel';
import { DisplayType } from './VerificationStore';

const rootStore = new RootStore();

jest.mock('../../services/member/VerificationService.ts');
const mockedPostApi = verificationServiceInstance as jest.Mocked<typeof verificationServiceInstance>;

describe('VerificationStore 테스트', () => {
  const { verificationStore } = rootStore;

  describe('checkVerificationNumber() 테스트', () => {
    let mockApiResponse: BeApiResponse<VerificationResult> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
      data: {
        sequenceNumber: 128,
        verificationNumberMatchYn: 'Y',
        memberJoinYn: 'N',
        memberJoinType: '',
        verificationNumberWrongCount: 0,
        timeoutYn: '',
      },
    };

    it('인증번호 일치 - 기가입되어 있지 않음(회원가입)', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');
      verificationStore.setProcessType(ProcessType.SIGN_UP);

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(result).toEqual(128);
      expect(verificationStore.goNextStep).toBe(true);
    });

    it('인증번호 일치 - 기가입되어 있지 않음(비밀번호찾기)', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');
      verificationStore.setProcessType(ProcessType.RECOVERY_PASSWORD);

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(result).toEqual(128);
    });

    it('인증번호 일치 - 기가입되어 있음(SNS)', async () => {
      mockApiResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: {
          sequenceNumber: 128,
          verificationNumberMatchYn: 'Y',
          memberJoinYn: 'Y',
          memberJoinType: SignUpType.SNS,
          verificationNumberWrongCount: 0,
          timeoutYn: '',
        },
      };

      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.verifyAndEmailExist).toBe(true);
      expect(verificationStore.memberJoinType).toBe(SignUpType.SNS);
      expect(verificationStore.displayType).toBe(DisplayType.ACCOUNTEXIST);
      expect(result).toEqual(128);
    });

    it('인증번호 일치 - 기가입되어 있음(ID)', async () => {
      mockApiResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: {
          sequenceNumber: 128,
          verificationNumberMatchYn: 'Y',
          memberJoinYn: 'Y',
          memberJoinType: SignUpType.ID,
          verificationNumberWrongCount: 0,
          timeoutYn: '',
        },
      };

      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');
      verificationStore.setProcessType(ProcessType.SIGN_UP);

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.verifyAndEmailExist).toBe(true);
      expect(verificationStore.memberJoinType).toBe(SignUpType.ID);
      expect(result).toEqual(128);
    });

    it('인증번호 일치 - 기가입되어 있음(INTEGRATE)', async () => {
      mockApiResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: {
          sequenceNumber: 128,
          verificationNumberMatchYn: 'Y',
          memberJoinYn: 'Y',
          memberJoinType: SignUpType.INTEGRATE,
          verificationNumberWrongCount: 0,
          timeoutYn: '',
        },
      };

      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');
      verificationStore.setProcessType(ProcessType.RECOVERY_PASSWORD);

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      // expect(verificationStore.verifyAndEmailExist).toBe(true);
      // expect(verificationStore.memberJoinType).toBe(SignUpType.INTEGRATE);
      // expect(result).toEqual(128);
      expect(verificationStore.goNextStep).toBe(true);
    });

    it('인증번호 일치하지 않음', async () => {
      mockApiResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: {
          sequenceNumber: 0,
          verificationNumberMatchYn: 'N',
          memberJoinYn: '',
          memberJoinType: '',
          verificationNumberWrongCount: 1,
          timeoutYn: '',
        },
      };

      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.failCount).toBe(1);
      expect(verificationStore.alertMessage).toBe(t('member:signUp.verification.msgInvalidCode'));
      expect(verificationStore.alertSeverity).toBe('error');
      expect(verificationStore.needClearAndFocusVerificationNumber).toBe(true);
      expect(result).toBe(-1);
    });

    it('인증번호 일치하지 않음 - 5회틀림(SignUp)', async () => {
      mockApiResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: {
          sequenceNumber: 0,
          verificationNumberMatchYn: 'N',
          memberJoinYn: '',
          memberJoinType: '',
          verificationNumberWrongCount: 5,
          timeoutYn: '',
        },
      };

      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');
      verificationStore.setProcessType(ProcessType.SIGN_UP);

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.navigateUrl).toBe('/signUp');
      expect(result).toBe(-1);
    });

    it('인증번호 일치하지 않음 - 5회틀림(RecoveryPassword)', async () => {
      mockApiResponse = {
        successOrNot: 'Y',
        statusCode: 'SUCCESS',
        data: {
          sequenceNumber: 0,
          verificationNumberMatchYn: 'N',
          memberJoinYn: '',
          memberJoinType: '',
          verificationNumberWrongCount: 5,
          timeoutYn: '',
        },
      };

      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('123456');
      verificationStore.setProcessType(ProcessType.RECOVERY_PASSWORD);

      mockedPostApi.checkVerificationNumber.mockResolvedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.navigateUrl).toBe('/login');
      expect(result).toBe(-1);
    });

    it('인증번호 확인 실패 - 필수값 누락', async () => {
      mockApiResponse = { successOrNot: 'N', statusCode: 'MANDATORY_PARAM_ERR' };

      mockedPostApi.checkVerificationNumber.mockRejectedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.exceptionMessage).toBe(
        t('member:signUp.verification.errorMessage.mandatoryParameterError')
      );
    });

    it('인증번호 확인 실패 - email format 맞지 않음', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns');
      mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_FORMAT' };

      mockedPostApi.checkVerificationNumber.mockRejectedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.exceptionMessage).toBe(t('member:signUp.verification.errorMessage.invalidFormat'));
    });

    it('인증번호 확인 실패 - sendType, useType 맞지 않음', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns.com');
      mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_PARAMETER' };

      mockedPostApi.checkVerificationNumber.mockRejectedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.exceptionMessage).toBe(t('member:signUp.verification.errorMessage.invalidParameter'));
    });

    it('인증번호 확인 실패 - SEND데이터가 없는 상태에서 RESEND로 요청', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns.com');
      mockApiResponse = { successOrNot: 'N', statusCode: 'NO_HAVE_SEND_DATA' };

      mockedPostApi.checkVerificationNumber.mockRejectedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.exceptionMessage).toBe(t('member:signUp.verification.errorMessage.noHaveSendData'));
    });

    it('인증번호 확인 실패 - 인증번호가 6자리가 아닌 경우', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('1234');
      mockApiResponse = { successOrNot: 'N', statusCode: 'PARAM_LENGTH_ERR' };

      mockedPostApi.checkVerificationNumber.mockRejectedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.exceptionMessage).toBe(t('member:signUp.verification.errorMessage.paramLengthError'));
    });

    it('인증번호 확인 실패 - 유효하지 않은 번호', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('1234');
      mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_VERIFICATION_NUMBER' };

      mockedPostApi.checkVerificationNumber.mockRejectedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.alertMessage).toBe(t('member:signUp.verification.msgInvalidCode'));
      expect(verificationStore.verificationNumber).toBe('');
      expect(verificationStore.needClearAndFocusVerificationNumber).toBe(true);
    });

    it('인증번호 확인 실패 - 서버에러', async () => {
      verificationStore.setEmailAddress('blue1day@lgcns.com');
      verificationStore.setVerificationNumber('1234');
      mockApiResponse = { successOrNot: 'N', statusCode: 'UNKNOWN' };

      mockedPostApi.checkVerificationNumber.mockRejectedValue(mockApiResponse);
      const result = await verificationStore.checkVerificationNumber();

      expect(verificationStore.exceptionMessage).toBe(t('member:signUp.signUp.errorMessage.unknownServer'));
    });
  });

  it('setAlertMessage() 호출', () => {
    const alertSeverity = 'error';
    const alertMessage = 'message';
    verificationStore.setAlertMessage(alertSeverity, alertMessage);
    expect(verificationStore.alertSeverity).toBe(alertSeverity);
    expect(verificationStore.alertMessage).toBe(alertMessage);
  });

  it('resetAlertMessage() 호출', () => {
    verificationStore.resetAlertMessage();
    expect(verificationStore.alertMessage).toBe('');
  });

  it('setVerificationNumber() 호출', () => {
    const verificationNumber = '123456';
    verificationStore.setVerificationNumber(verificationNumber);
    expect(verificationStore.verificationNumber).toBe(verificationNumber);
  });

  it('resetVerificationNumber() 호출', () => {
    verificationStore.resetVerificationNumber();
    expect(verificationStore.verificationNumber).toBe('');
  });

  it('increaseFailCount() 호출', () => {
    const failCount = verificationStore.failCount;
    const toBeFailCount = failCount + 1;
    verificationStore.increaseFailCount();
    expect(verificationStore.failCount).toBe(toBeFailCount);
  });

  it('setVerifyAndEmailExists() 호출', () => {
    const verifyAndEmailExist = true;
    const memberJoinType = SignUpType.ID;
    verificationStore.setVerifyAndEmailExists(verifyAndEmailExist, memberJoinType);
    expect(verificationStore.verifyAndEmailExist).toBe(verifyAndEmailExist);
    expect(verificationStore.memberJoinType).toBe(memberJoinType);
  });

  it('setProcessType() 호출', () => {
    const processType = ProcessType.SIGN_UP;
    verificationStore.setProcessType(processType);
    expect(verificationStore.processType).toBe(processType);
  });

  it('setEmailAddress() 호출', () => {
    const emailAddress = 'blue1day@lgcns.com';
    verificationStore.setEmailAddress(emailAddress);
    expect(verificationStore.emailAddress).toBe(emailAddress);
  });

  it('setCountdownTime() 호출', () => {
    const countdownTime = Date.now();
    verificationStore.setCountdownTime(countdownTime);
    expect(verificationStore.countdownTime).toBe(countdownTime);
  });

  it('setUseType() 호출 - signUp', () => {
    const processType = ProcessType.SIGN_UP;
    verificationStore.setUseType(processType);
    expect(verificationStore.useType).toBe(UseType.SIGN_UP);
  });

  it('setUseType() 호출 - recoveryPassword', () => {
    const processType = ProcessType.RECOVERY_PASSWORD;
    verificationStore.setUseType(processType);
    expect(verificationStore.useType).toBe(UseType.PASSWORD_CHANGE);
  });

  it('setUseType() 호출 - 기타', () => {
    verificationStore.cleanUp();
    const processType = ProcessType.UNKNOWN;
    verificationStore.setUseType(processType);
    expect(verificationStore.useType).toBe(UseType.SIGN_UP);
  });

  it('setNeedClearAndFocusVerificationNumber() 호출', () => {
    verificationStore.cleanUp();
    verificationStore.setNeedClearAndFocusVerificationNumber(true);
    expect(verificationStore.needClearAndFocusVerificationNumber).toBe(true);
  });

  it('setExceptionMessage() 호출', () => {
    verificationStore.cleanUp();
    verificationStore.setExceptionMessage('exception');
    expect(verificationStore.exceptionMessage).toBe('exception');
  });

  it('isTooManyFailed() 호출', () => {
    verificationStore.cleanUp();
    verificationStore.failCount = 5;
    expect(verificationStore.isTooManyFailed).toBe(true);
  });
});

jest.mock('../../services/member/RecoveryPasswordService.ts');
const mockedRecoveryPasswordApi = recoveryPasswordServiceInstance as jest.Mocked<
  typeof recoveryPasswordServiceInstance
>;
describe('resendCode() 테스트', () => {
  const { verificationStore, recoveryPasswordStore } = rootStore;
  let mockApiResponse: BeApiResponse<SendEmailResult> = {
    successOrNot: 'Y',
    statusCode: 'SUCCESS',
    data: { reSendCount: 1, reSendCountLimit: 5 },
  };

  it('인증 이메일 재발송 성공', async () => {
    verificationStore.setEmailAddress('blue1day@lgcns.com');
    mockedRecoveryPasswordApi.sendEmailVerification.mockResolvedValue(mockApiResponse);

    jest.useFakeTimers();

    const result = await verificationStore.resendCode();

    expect(result).toEqual(true);
    expect(verificationStore.verificationNumber).toBe('');
    expect(verificationStore.alertMessage).toBe('');
    expect(verificationStore.needClearAndFocusVerificationNumber).toBe(true);
    setTimeout(() => expect(verificationStore.disableResend).toBe(false), 1000);

    jest.runAllTimers();
  });

  it('인증 이메일 재발송 실패 - 필수값 누락', async () => {
    mockApiResponse = { successOrNot: 'N', statusCode: 'MANDATORY_PARAM_ERR' };

    mockedRecoveryPasswordApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
    const result = await verificationStore.resendCode();

    expect(verificationStore.exceptionMessage).toBe(
      t('member:signUp.verification.errorMessage.mandatoryParameterError')
    );
  });

  it('인증 이메일 재발송 실패 - email format 맞지 않음', async () => {
    mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_FORMAT' };

    mockedRecoveryPasswordApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
    const result = await verificationStore.resendCode();

    expect(verificationStore.exceptionMessage).toBe(t('member:signUp.verification.errorMessage.invalidFormat'));
  });

  it('인증 이메일 재발송 실패 - sendType, useType이 맞지 않는 경우', async () => {
    mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_PARAMETER' };

    mockedRecoveryPasswordApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
    const result = await verificationStore.resendCode();

    expect(verificationStore.exceptionMessage).toBe(t('member:signUp.verification.errorMessage.invalidParameter'));
  });

  it('인증 이메일 재발송 실패 - 10분 기준 재발송건이 5회 이상', async () => {
    mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_RESEND_COUNT_LIMIT' };

    mockedRecoveryPasswordApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
    const result = await verificationStore.resendCode();

    expect(verificationStore.alertMessage).toBe(t('member:signUp.verification:msgTooManyAttempts'));
    expect(verificationStore.verificationNumber).toBe('');
    expect(verificationStore.needClearAndFocusVerificationNumber).toBe(true);
    expect(result).toBe(false);
  });

  it('인증 이메일 재발송 실패 - 서버 오류', async () => {
    mockApiResponse = { successOrNot: 'N', statusCode: 'UNKNOWN' };

    mockedRecoveryPasswordApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
    const result = await verificationStore.resendCode();

    expect(verificationStore.exceptionMessage).toBe(t('member:signUp.signUp.errorMessage.unknownServer'));
  });
});
