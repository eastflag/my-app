import { StatusCode } from '../../services/common/model/Error';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import RootStore from '../Store';
import SignUpFormStore from './SignUpFormStore';
import * as CommonToast from '../../components/common/CommonToast';

jest.mock('../../services/member/RecoveryPasswordService');
const mockedRecoveryPasswordServiceInstance = recoveryPasswordServiceInstance as jest.Mocked<
  typeof recoveryPasswordServiceInstance
>;

jest.mock('../../components/common/CommonToast');
const mockedCommonToast = CommonToast as jest.Mocked<typeof CommonToast>;

describe('Sign Up Form Store', () => {
  const rootStore: RootStore = new RootStore();
  let signUpFormStore: SignUpFormStore;

  beforeEach(() => {
    signUpFormStore = new SignUpFormStore(rootStore);
    rootStore.signUpFormStore = signUpFormStore;
  });

  describe('setEmailAddress()', () => {
    it('should set email address', () => {
      signUpFormStore.setEmailAddress('a@a.com');
      expect(signUpFormStore.emailAddress).toBe('a@a.com');
    });
  });

  describe('sendEmailVerification()', () => {
    it('success should return true', async () => {
      const emailAddress = 'a@a.com';

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: {
          reSendCount: 0,
          reSendCountLimit: 0,
        },
      });

      const result = await signUpFormStore.sendEmailVerification(emailAddress);

      expect(result).toBe(true);
    });

    it('fail should return false', async () => {
      const emailAddress = 'a@a.com';

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue({
        successOrNot: 'N',
        statusCode: StatusCode.FAIL,
      });

      const result = await signUpFormStore.sendEmailVerification(emailAddress);

      expect(result).toBe(false);
    });

    it('fail with status code MANDATORY_PARAM_ERR', async () => {
      const emailAddress = 'a@a.com';

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue({
        successOrNot: 'N',
        statusCode: StatusCode.MANDATORY_PARAM_ERR,
      });

      await signUpFormStore.sendEmailVerification(emailAddress);

      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('fail with status code INVALID_FORMAT', async () => {
      const emailAddress = 'a@a.com';

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue({
        successOrNot: 'N',
        statusCode: StatusCode.INVALID_FORMAT,
      });

      await signUpFormStore.sendEmailVerification(emailAddress);

      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('fail with status code INVALID_PARAMETER', async () => {
      const emailAddress = 'a@a.com';

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue({
        successOrNot: 'N',
        statusCode: StatusCode.INVALID_PARAMETER,
      });

      await signUpFormStore.sendEmailVerification(emailAddress);

      expect(mockedCommonToast.showToast).toBeCalled();
    });

    it('fail with status code NO_HAVE_SEND_DATA', async () => {
      const emailAddress = 'a@a.com';

      mockedRecoveryPasswordServiceInstance.sendEmailVerification.mockRejectedValue({
        successOrNot: 'N',
        statusCode: StatusCode.NO_HAVE_SEND_DATA,
      });

      await signUpFormStore.sendEmailVerification(emailAddress);

      expect(mockedCommonToast.showToast).toBeCalled();
    });
  });
});
