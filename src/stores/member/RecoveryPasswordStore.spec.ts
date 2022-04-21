import { t } from 'i18next';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { SendEmailResult } from '../../services/member/model/SendEmailResultModel';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import RootStore from '../Store';
import { ProcessType, UseType } from './model/memberModel';

const rootStore = new RootStore();

jest.mock('../../services/member/RecoveryPasswordService.ts');
const mockedPostApi = recoveryPasswordServiceInstance as jest.Mocked<typeof recoveryPasswordServiceInstance>;

describe('RecoveryPasswordStore 테스트', () => {
  const { recoveryPasswordStore } = rootStore;

  describe('sendEmailVerification() 테스트', () => {
    let mockApiResponse: BeApiResponse<SendEmailResult> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
      data: { reSendCount: 0, reSendCountLimit: 5 },
    };

    it('인증 이메일 발송 성공', async () => {
      recoveryPasswordStore.setEmailAddress('blue1day@lgcns.com');
      mockedPostApi.sendEmailVerification.mockResolvedValue(mockApiResponse);
      const result = await recoveryPasswordStore.sendEmailVerification();

      expect(result).toEqual(true);
    });

    it('인증 이메일 발송 실패 - 필수값 누락', async () => {
      mockApiResponse = { successOrNot: 'N', statusCode: 'MANDATORY_PARAM_ERR' };

      mockedPostApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await recoveryPasswordStore.sendEmailVerification();

      expect(recoveryPasswordStore.exceptionMessage).toBe(
        t('member:recoveryPassword.errorMessage.mandatoryParameterError')
      );
    });

    it('인증 이메일 발송 실패 - email format 맞지 않음', async () => {
      recoveryPasswordStore.setEmailAddress('blue1day@lgcns');
      mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_FORMAT' };

      mockedPostApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await recoveryPasswordStore.sendEmailVerification();

      expect(recoveryPasswordStore.exceptionMessage).toBe(t('member:recoveryPassword.errorMessage.invalidFormat'));
    });

    it('인증 이메일 발송 실패 - sendType, useType 맞지 않음', async () => {
      recoveryPasswordStore.setEmailAddress('blue1day@lgcns.com');
      mockApiResponse = { successOrNot: 'N', statusCode: 'INVALID_PARAMETER' };

      mockedPostApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await recoveryPasswordStore.sendEmailVerification();

      expect(recoveryPasswordStore.exceptionMessage).toBe(t('member:recoveryPassword.errorMessage.invalidParameter'));
    });

    it('인증 이메일 발송 실패 - SEND데이터가 없는 상태에서 RESEND로 요청', async () => {
      recoveryPasswordStore.setEmailAddress('blue1day@lgcns.com');
      mockApiResponse = { successOrNot: 'N', statusCode: 'NO_HAVE_SEND_DATA' };

      mockedPostApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await recoveryPasswordStore.sendEmailVerification();

      expect(recoveryPasswordStore.exceptionMessage).toBe(t('member:recoveryPassword.errorMessage.noHaveSendData'));
    });

    it('인증 이메일 발송 실패 - 서버에러', async () => {
      recoveryPasswordStore.setEmailAddress('blue1day@lgcns.com');
      mockApiResponse = { successOrNot: 'N', statusCode: 'UNKNOWN' };

      mockedPostApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await recoveryPasswordStore.sendEmailVerification();

      expect(recoveryPasswordStore.exceptionMessage).toBe(t('member:signUp.signUp.errorMessage.unknownServer'));
    });

    it('인증 이메일 발송 실패 - 결과없음', async () => {
      recoveryPasswordStore.setEmailAddress('blue1day@lgcns.com');
      mockApiResponse = { successOrNot: 'N', statusCode: '' };

      mockedPostApi.sendEmailVerification.mockRejectedValue(mockApiResponse);
      const result = await recoveryPasswordStore.sendEmailVerification();

      expect(result).toBe(false);
    });
  });

  it('setEmailAddress() 호출', () => {
    const emailAddress = 'blue1day@lgcns.com';
    recoveryPasswordStore.setEmailAddress(emailAddress);
    expect(recoveryPasswordStore.emailAddress).toBe(emailAddress);
  });

  it('setUseType() 호출 - signUp', () => {
    const processType = ProcessType.SIGN_UP;
    recoveryPasswordStore.setUseType(processType);
    expect(recoveryPasswordStore.useType).toBe(UseType.SIGN_UP);
  });

  it('setUseType() 호출 - recoveryPassword', () => {
    const processType = ProcessType.RECOVERY_PASSWORD;
    recoveryPasswordStore.setUseType(processType);
    expect(recoveryPasswordStore.useType).toBe(UseType.PASSWORD_CHANGE);
  });

  it('setUseType() 호출 - 기타', () => {
    recoveryPasswordStore.cleanUp();
    const processType = '';
    recoveryPasswordStore.setUseType(processType);
    expect(recoveryPasswordStore.useType).toBe(UseType.SIGN_UP);
  });

  it('setExceptionMessage() 호출', () => {
    const exceptionMessage = 'exception';
    recoveryPasswordStore.setExceptionMessage(exceptionMessage);
    expect(recoveryPasswordStore.exceptionMessage).toBe(exceptionMessage);
  });

  it('cleanUp() 호출', () => {
    recoveryPasswordStore.cleanUp();
    expect(recoveryPasswordStore.emailAddress).toBe('');
    expect(recoveryPasswordStore.exceptionMessage).toBe('');
    expect(recoveryPasswordStore.useType).toBe(UseType.SIGN_UP);
  });
});
