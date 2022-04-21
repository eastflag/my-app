import * as CommonToast from '../../components/common/CommonToast';
import { StatusCode } from '../../services/common/model/Error';
import { sessionStorageServiceInstance } from '../../services/common/SessionStorageService';
import { integrateServiceInstance } from '../../services/member/IntegrateService';
import { memberServiceInstance } from '../../services/member/MemberService';
import RootStore from '../Store';
import TermStore, { TermType } from '../terms/TermStore';
import { ProcessType, SignUpType } from './model/memberModel';
import SignUpComposedStore, {
  NavigationInfo,
  SnsLoginQueryResponse,
  SnsLoginType,
  SnsType,
} from './SignUpComposedStore';

jest.mock('../../services/common/SessionStorageService');

jest.mock('../../components/common/CommonToast');
const mockedCommonToast = CommonToast as jest.Mocked<typeof CommonToast>;

jest.mock('../../services/member/IntegrateService');
const mockIntegrateServiceInstance = integrateServiceInstance as jest.Mocked<typeof integrateServiceInstance>;

jest.mock('../terms/TermStore');

jest.mock('../../services/member/MemberService');
const mockMemberServiceInstance = memberServiceInstance as jest.Mocked<typeof memberServiceInstance>;

describe('SignupComposedStore', () => {
  const rootStore: RootStore = new RootStore();
  let signUpComposedStore: SignUpComposedStore;
  const mockedTermStore = rootStore.termStore as jest.Mocked<TermStore>;

  beforeEach(() => {
    signUpComposedStore = new SignUpComposedStore(rootStore);
    rootStore.signUpComposedStore = signUpComposedStore;
  });

  it('store created.', () => {
    expect(signUpComposedStore).toBeInstanceOf(SignUpComposedStore);
  });

  it('store initial value', () => {
    expect(signUpComposedStore).toMatchInlineSnapshot(
      {
        root: expect.any(RootStore),
      },
      `
      Object {
        "callApiWithConfig": [Function],
        "callApiWithState": [Function],
        "callApiWithStateEvenLoading": [Function],
        "confirmPassword": "",
        "emailAddress": "",
        "error": undefined,
        "isNicknameDuplicated": false,
        "isTermAgreed": false,
        "loading": false,
        "nickname": "",
        "password": "",
        "processType": "signUp",
        "root": Any<RootStore>,
        "sequenceNumber": -1,
        "signUpType": "ID",
        "snsLoginSequenceNumber": "",
        "snsType": "unknown",
        "step": 0,
        "termAgreeDatetime": null,
        "verificationNumber": "",
        "verificationType": "EMAIL",
      }
    `
    );
  });

  describe('setStep()', () => {
    it('set', () => {
      signUpComposedStore.setStep(1);

      expect(signUpComposedStore.step).toEqual(1);
    });

    it('set twice', () => {
      signUpComposedStore.setStep(1);
      signUpComposedStore.setStep(2);

      expect(signUpComposedStore.step).toEqual(2);
    });
  });

  describe('toNextStep', () => {
    it('call once', () => {
      signUpComposedStore.toNextStep();

      expect(signUpComposedStore.step).toEqual(1);
    });

    it('call many times', () => {
      signUpComposedStore.toNextStep();
      signUpComposedStore.toNextStep();
      signUpComposedStore.toNextStep();
      signUpComposedStore.toNextStep();
      signUpComposedStore.toNextStep();

      expect(signUpComposedStore.step).toEqual(5);
    });

    it('call after set step', () => {
      signUpComposedStore.setStep(5);
      signUpComposedStore.toNextStep();

      expect(signUpComposedStore.step).toEqual(6);
    });

    it('call before set step', () => {
      signUpComposedStore.toNextStep();
      signUpComposedStore.setStep(5);

      expect(signUpComposedStore.step).toEqual(5);
    });

    it('if step is NaN should to 0', () => {
      signUpComposedStore.setStep(NaN);
      signUpComposedStore.toNextStep();

      expect(signUpComposedStore.step).toEqual(0);
    });
  });

  describe('setEmailAddress()', () => {
    it('set', () => {
      const emailTestValue = 'a@a.a';
      signUpComposedStore.setEmailAddress(emailTestValue);

      expect(signUpComposedStore.emailAddress).toEqual(emailTestValue);
    });

    it('set twice', () => {
      const emailTestValue1 = 'a@a.a';
      const emailTestValue2 = 'b@b.b';
      signUpComposedStore.setEmailAddress(emailTestValue1);
      signUpComposedStore.setEmailAddress(emailTestValue2);

      expect(signUpComposedStore.emailAddress).toEqual(emailTestValue2);
    });
  });

  describe('setPassword()', () => {
    it('set', () => {
      const passwordTestValue = 'TestPassword!@#';
      signUpComposedStore.setPassword(passwordTestValue);

      expect(signUpComposedStore.password).toEqual(passwordTestValue);
    });

    it('set twice', () => {
      const passwordTestValue1 = 'TestPassword!@#';
      const passwordTestValue2 = 'asdfpassword';
      signUpComposedStore.setPassword(passwordTestValue1);
      signUpComposedStore.setPassword(passwordTestValue2);

      expect(signUpComposedStore.password).toEqual(passwordTestValue2);
    });
  });

  describe('setConfirmPassword()', () => {
    it('set', () => {
      const confirmPasswordTestValue = 'TestPassword!@#';
      signUpComposedStore.setConfirmPassword(confirmPasswordTestValue);

      expect(signUpComposedStore.confirmPassword).toEqual(confirmPasswordTestValue);
    });

    it('set twice', () => {
      const confirmPasswordTestValue1 = 'TestPassword!@#';
      const confirmPasswordTestValue2 = 'asdfpassword';
      signUpComposedStore.setConfirmPassword(confirmPasswordTestValue1);
      signUpComposedStore.setConfirmPassword(confirmPasswordTestValue2);

      expect(signUpComposedStore.confirmPassword).toEqual(confirmPasswordTestValue2);
    });
  });

  describe('setProcessType()', () => {
    it('set', () => {
      const processTypeTestValue = ProcessType.SIGN_UP;
      signUpComposedStore.setProcessType(processTypeTestValue);

      expect(signUpComposedStore.processType).toEqual(processTypeTestValue);
    });

    it('set twice', () => {
      const processTypeTestValue1 = ProcessType.SIGN_UP;
      const processTypeTestValue2 = ProcessType.RECOVERY_PASSWORD;
      signUpComposedStore.setProcessType(processTypeTestValue1);
      signUpComposedStore.setProcessType(processTypeTestValue2);

      expect(signUpComposedStore.processType).toEqual(processTypeTestValue2);
    });
  });

  describe('setNickname()', () => {
    it('set', () => {
      const nicknameTestValue = 'mynickname';
      signUpComposedStore.setNickname(nicknameTestValue);

      expect(signUpComposedStore.nickname).toEqual(nicknameTestValue);
    });

    it('set twice', () => {
      const nicknameTestValue1 = 'mynickname';
      const nicknameTestValue2 = 'mynewnickname';
      signUpComposedStore.setNickname(nicknameTestValue1);
      signUpComposedStore.setNickname(nicknameTestValue2);

      expect(signUpComposedStore.nickname).toEqual(nicknameTestValue2);
    });
  });

  describe('setSignUpType()', () => {
    it('set', () => {
      const testValue = SignUpType.ID;
      signUpComposedStore.setSignUpType(testValue);

      expect(signUpComposedStore.signUpType).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = SignUpType.ID;
      const testValue2 = SignUpType.SNS;
      signUpComposedStore.setSignUpType(testValue1);
      signUpComposedStore.setSignUpType(testValue2);

      expect(signUpComposedStore.signUpType).toEqual(testValue2);
    });
  });

  describe('setSnsType()', () => {
    it('set', () => {
      const testValue = SnsType.GOOGLE;
      signUpComposedStore.setSnsType(testValue);

      expect(signUpComposedStore.snsType).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = SnsType.GOOGLE;
      const testValue2 = SnsType.APPLE;
      signUpComposedStore.setSnsType(testValue1);
      signUpComposedStore.setSnsType(testValue2);

      expect(signUpComposedStore.snsType).toEqual(testValue2);
    });
  });

  describe('setVerificationNumber()', () => {
    it('set', () => {
      const testValue = '013533';
      signUpComposedStore.setVerificationNumber(testValue);

      expect(signUpComposedStore.verificationNumber).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = '013533';
      const testValue2 = '235373';
      signUpComposedStore.setVerificationNumber(testValue1);
      signUpComposedStore.setVerificationNumber(testValue2);

      expect(signUpComposedStore.verificationNumber).toEqual(testValue2);
    });
  });

  describe('setIsTermAgreed()', () => {
    it('set', () => {
      const testValue = false;
      signUpComposedStore.setIsTermAgreed(testValue);

      expect(signUpComposedStore.isTermAgreed).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = false;
      const testValue2 = true;
      signUpComposedStore.setIsTermAgreed(testValue1);
      signUpComposedStore.setIsTermAgreed(testValue2);

      expect(signUpComposedStore.isTermAgreed).toEqual(testValue2);
    });
  });

  describe('setTermAgreeDateTime()', () => {
    it('set', () => {
      const testValue = new Date('Mon Mar 07 2022 16:26:40 GMT+0900');
      signUpComposedStore.setTermAgreeDateTime(testValue);

      expect(signUpComposedStore.termAgreeDatetime).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = new Date('Mon Mar 07 2022 16:26:40 GMT+0900');
      const testValue2 = new Date('Mon Mar 07 2021 12:00:12 GMT+0900');
      signUpComposedStore.setTermAgreeDateTime(testValue1);
      signUpComposedStore.setTermAgreeDateTime(testValue2);

      expect(signUpComposedStore.termAgreeDatetime).toEqual(testValue2);
    });
  });

  describe('setSequenceNumber()', () => {
    it('set', () => {
      const testValue = 33;
      signUpComposedStore.setSequenceNumber(testValue);

      expect(signUpComposedStore.sequenceNumber).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = 33;
      const testValue2 = 12;
      signUpComposedStore.setSequenceNumber(testValue1);
      signUpComposedStore.setSequenceNumber(testValue2);

      expect(signUpComposedStore.sequenceNumber).toEqual(testValue2);
    });
  });

  describe('setSnsLoginSequenceNumber()', () => {
    it('set', () => {
      const testValue = '33';
      signUpComposedStore.setSnsLoginSequenceNumber(testValue);

      expect(signUpComposedStore.snsLoginSequenceNumber).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = '33';
      const testValue2 = '12';
      signUpComposedStore.setSnsLoginSequenceNumber(testValue1);
      signUpComposedStore.setSnsLoginSequenceNumber(testValue2);

      expect(signUpComposedStore.snsLoginSequenceNumber).toEqual(testValue2);
    });
  });

  describe('getNavigationInfoWithSnsLogin()', () => {
    it('to integrate', () => {
      const testQueryParams: SnsLoginQueryResponse = {
        emailAddress: 'a@a.a',
        sequenceNumber: '123',
        idToken: undefined,
        type: SnsLoginType.INTEGRATE,
      };

      const result = signUpComposedStore.getNavigationInfoWithSnsLogin(testQueryParams);
      const expected: NavigationInfo = {
        to: '/signUp/integrate',
        additionalInfo: {
          emailAddress: testQueryParams.emailAddress,
          sequenceNumber: testQueryParams.sequenceNumber,
        },
      };
      expect(result).toMatchObject(expected);
    });

    it('to sign up', () => {
      const testQueryParams: SnsLoginQueryResponse = {
        emailAddress: 'a@a.a',
        sequenceNumber: '123',
        idToken: undefined,
        type: SnsLoginType.SIGNUP,
      };

      const result = signUpComposedStore.getNavigationInfoWithSnsLogin(testQueryParams);
      const expected: NavigationInfo = {
        to: '/signUp/sns',
        additionalInfo: {
          emailAddress: testQueryParams.emailAddress,
          sequenceNumber: testQueryParams.sequenceNumber,
        },
      };
      expect(result).toMatchObject(expected);
    });

    it('to login', () => {
      const testQueryParams: SnsLoginQueryResponse = {
        emailAddress: 'a@a.a',
        sequenceNumber: '123',
        idToken: 'thisisIdToken',
        type: SnsLoginType.SIGNIN,
      };

      const result = signUpComposedStore.getNavigationInfoWithSnsLogin(testQueryParams);
      const expected: NavigationInfo = {
        to: '/main',
      };

      expect(result).toMatchObject(expected);
    });

    it('do nothing', () => {
      const testQueryParams: SnsLoginQueryResponse = {
        emailAddress: 'a@a.a',
        sequenceNumber: '123',
        idToken: 'thisisIdToken',
        type: 'abc',
      };

      const result = signUpComposedStore.getNavigationInfoWithSnsLogin(testQueryParams);
      const expected: NavigationInfo = {};

      expect(result).toMatchObject(expected);
    });
  });

  describe('termAgreements()', () => {
    afterEach(() => {
      rootStore.termStore = mockedTermStore;
    });
    it('get', () => {
      mockedTermStore.getLatestTermByType.mockReturnValue({
        termId: 1,
        termTitle: 'title1',
        termContent: 'content1',
        termVersion: 'version',
        termType: TermType.SERVICE,
      });

      const result = signUpComposedStore.termAgreements;
      const expected = [
        {
          agree: false,
          agreeDatetime: null,
          termId: 1,
          termTitle: 'title1',
          termContent: 'content1',
          termVersion: 'version',
          termType: TermType.SERVICE,
        },
        {
          agree: false,
          agreeDatetime: null,
          termId: 1,
          termTitle: 'title1',
          termContent: 'content1',
          termVersion: 'version',
          termType: TermType.SERVICE,
        },
      ];

      expect(result).toMatchObject(expected);
    });

    it('should return if termStore is exist', () => {
      rootStore.termStore = null as unknown as TermStore;

      const result = signUpComposedStore.termAgreements;
      expect(result).toMatchObject([]);
    });
  });

  describe('cleanUp()', () => {
    beforeEach(() => {
      signUpComposedStore.setStep(0);
    });
    it('with empty', () => {
      signUpComposedStore.cleanUp();
      expect(signUpComposedStore.step).toBe(0);
      expect(signUpComposedStore.signUpType).toBe('unknown');
    });
  });

  describe('signUpSnsAgreeTermAndSubmit()', () => {
    it('success case should change step to next', async () => {
      const currentStep = 0;
      signUpComposedStore.setStep(currentStep);

      await signUpComposedStore.signUpSnsAgreeTermAndSubmit();

      expect(signUpComposedStore.step).toEqual(currentStep + 1);
    });
  });

  describe('signUpSubmit()', () => {
    it('success case should change step to next', async () => {
      const currentStep = 0;
      signUpComposedStore.setStep(currentStep);

      mockMemberServiceInstance.signUp.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: {
          idToken: 'test_id_token_123',
        },
      });

      await signUpComposedStore.signUpSubmit();

      expect(signUpComposedStore.step).toEqual(currentStep + 1);
    });
  });

  describe('setIsNicknameDuplicated()', () => {
    it('set', () => {
      const testValue = false;
      signUpComposedStore.setIsNicknameDuplicated(testValue);

      expect(signUpComposedStore.isNicknameDuplicated).toEqual(testValue);
    });

    it('set twice', () => {
      const testValue1 = false;
      const testValue2 = true;
      signUpComposedStore.setIsNicknameDuplicated(testValue1);
      signUpComposedStore.setIsNicknameDuplicated(testValue2);

      expect(signUpComposedStore.isNicknameDuplicated).toEqual(testValue2);
    });
  });
});
