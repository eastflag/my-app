import * as CommonToast from '../../components/common/CommonToast';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { memberServiceInstance } from '../../services/member/MemberService';
import { ValidateMemberUnlockHashResponse } from '../../services/member/model/SetPassword';
import RootStore from '../Store';
import { ProcessType, SignUpType } from './model/memberModel';

const rootStore = new RootStore();

jest.mock('../../services/member/MemberService.ts');
const mockedMemberServiceInstacne = memberServiceInstance as jest.Mocked<typeof memberServiceInstance>;

jest.mock('../../components/common/CommonToast');
const mockedCommonToast = CommonToast as jest.Mocked<typeof CommonToast>;

describe('recoveryPasswordComposedStore 테스트', () => {
  const { recoveryPasswordComposedStore } = rootStore;

  it('cleanUp 호출', () => {
    recoveryPasswordComposedStore.cleanUp();
    expect(recoveryPasswordComposedStore.emailAddress).toBe('');
  });

  it('getStep 호출', () => {
    recoveryPasswordComposedStore.cleanUp();
    expect(recoveryPasswordComposedStore.emailAddress).toBe('');
  });

  it('toNextStep 호출', () => {
    const currentStep = recoveryPasswordComposedStore.step;
    const nextStep = currentStep + 1;
    recoveryPasswordComposedStore.toNextStep();
    expect(recoveryPasswordComposedStore.step).toBe(nextStep);
  });

  it('getEmailAddress, setEmailAddress 호출', () => {
    const emailAddress = 'blue1day@lgcns.com';
    recoveryPasswordComposedStore.setEmailAddress(emailAddress);

    expect(recoveryPasswordComposedStore.emailAddress).toBe(emailAddress);
  });

  it('setSequenceNumber 호출', () => {
    const sequenceNumber = 12;
    recoveryPasswordComposedStore.setSequenceNumber(sequenceNumber);

    expect(recoveryPasswordComposedStore.sequenceNumber).toBe(sequenceNumber);
  });

  it('setProcessType, getProcessType 호출 - signUp', () => {
    const processType = ProcessType.SIGN_UP;
    recoveryPasswordComposedStore.setProcessType(processType);

    expect(recoveryPasswordComposedStore.processType).toBe(processType);
  });

  it('setProcessType, getProcessType 호출 - recoveryPassword', () => {
    const processType = ProcessType.RECOVERY_PASSWORD;
    recoveryPasswordComposedStore.setProcessType(processType);

    expect(recoveryPasswordComposedStore.processType).toBe(processType);
  });

  it('setSignUpType, getSignUpType 호출 - ID', () => {
    const signUpType = SignUpType.ID;
    recoveryPasswordComposedStore.setSignUpType(signUpType);

    expect(recoveryPasswordComposedStore.signUpType).toBe(signUpType);
  });

  it('setSignUpType, getSignUpType 호출 - SNS', () => {
    const signUpType = SignUpType.SNS;
    recoveryPasswordComposedStore.setSignUpType(signUpType);

    expect(recoveryPasswordComposedStore.signUpType).toBe(signUpType);
  });

  it('setSignUpType, getSignUpType 호출 - INTEGRATE', () => {
    const signUpType = SignUpType.INTEGRATE;
    recoveryPasswordComposedStore.setSignUpType(signUpType);

    expect(recoveryPasswordComposedStore.signUpType).toBe(signUpType);
  });

  it('setSignUpType, getSignUpType 호출 - unknown', () => {
    const signUpType = SignUpType.UNKNOWN;
    recoveryPasswordComposedStore.setSignUpType(signUpType);

    expect(recoveryPasswordComposedStore.signUpType).toBe(signUpType);
  });

  it('getVerificationNumber, setVerificationNumber 호출', () => {
    const verificationNumber = '123456';
    recoveryPasswordComposedStore.setVerificationNumber(verificationNumber);

    expect(recoveryPasswordComposedStore.verificationNumber).toBe(verificationNumber);
  });

  it('validateAndSetWithRecoveryPasswordQueryParams, email, hash 검증 성공', async () => {
    const emailAddress = 'email@mail.com';
    const hash = 'hash';

    const mockApiResponse: BeApiResponse<ValidateMemberUnlockHashResponse> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
      data: {},
    };

    mockedMemberServiceInstacne.validateMemberUnlockHash.mockResolvedValue(mockApiResponse);

    await recoveryPasswordComposedStore.validateAndSetWithRecoveryPasswordQueryParams({
      emailAddress,
      hash,
    });

    expect(mockedCommonToast.showToast).toBeCalledTimes(0);
  });

  it('validateAndSetWithRecoveryPasswordQueryParams, email, hash 검증 실패', async () => {
    const emailAddress = 'email@mail.com';
    const hash = 'hash';

    const mockApiResponse: BeApiResponse<ValidateMemberUnlockHashResponse> = {
      successOrNot: 'N',
      statusCode: 'FAIL',
      data: {},
    };

    mockedMemberServiceInstacne.validateMemberUnlockHash.mockRejectedValue(mockApiResponse);

    await recoveryPasswordComposedStore.validateAndSetWithRecoveryPasswordQueryParams({
      emailAddress,
      hash,
    });

    expect(mockedCommonToast.showToast).toBeCalledTimes(1);
  });

  it('validateAndSetWithRecoveryPasswordQueryParams, email, hash 검증 응답 실패', async () => {
    const emailAddress = 'email@mail.com';
    const hash = 'hash';

    mockedMemberServiceInstacne.validateMemberUnlockHash.mockResolvedValue(
      {} as BeApiResponse<ValidateMemberUnlockHashResponse>
    );

    await recoveryPasswordComposedStore.validateAndSetWithRecoveryPasswordQueryParams({
      emailAddress,
      hash,
    });

    expect(mockedCommonToast.showToast).toBeCalled();
  });
});
