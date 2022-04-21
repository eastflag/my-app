import { BeApiResponse } from '../../services/common/model/RestApi';
import RootStore from '../Store';
import { ProcessType, SignUpType } from './model/memberModel';
import * as CommonToast from '../../components/common/CommonToast';
import { SetPasswordFormInfo } from '../../pages/member/components/SetPasswordForm';
import { SetPasswordResponse, SignUpResponse } from '../../services/member/model/SetPassword';

jest.mock('../../components/common/CommonToast.tsx');
const mockCommonToast = CommonToast as jest.Mocked<typeof CommonToast>;
const rootStore = new RootStore();

describe('PasswordStore 테스트', () => {
  const { passwordStore } = rootStore;

  describe('cleanup() 테스트', () => {
    it('cleanup 성공시, passwordStore 초기값으로 변경', async () => {
      passwordStore.cleanup();

      expect(passwordStore.signUpType).toEqual(SignUpType.UNKNOWN);
      expect(passwordStore.emailAddress).toEqual('');
      expect(passwordStore.confirmPassword).toEqual('');
      expect(passwordStore.password).toEqual('');
      expect(passwordStore.sequenceNumber).toEqual(-1);
      expect(passwordStore.processType).toEqual('');
      expect(passwordStore.showPassword).toEqual(false);
      expect(passwordStore.showConfirmPassword).toEqual(false);
      expect(passwordStore.isPasswordCapsLockOn).toEqual(false);
      expect(passwordStore.isPasswordConfirmCapsLockOn).toEqual(false);
      expect(passwordStore.termAgreements).toEqual([]);
    });
  });

  describe('setShowPassword() 테스트', () => {
    it('setShowPassword 성공시, 해당 값으로 변경', async () => {
      passwordStore.setShowPassword(true);
      expect(passwordStore.showPassword).toEqual(true);
    });
  });

  describe('setIsPasswordCapsLockOn() 테스트', () => {
    it('setIsPasswordCapsLockOn 성공시, 해당 값으로 변경', async () => {
      passwordStore.setIsPasswordCapsLockOn(true);
      expect(passwordStore.isPasswordCapsLockOn).toEqual(true);
    });
  });

  describe('setIsPasswordConfirmCapsLockOn() 테스트', () => {
    it('setIsPasswordConfirmCapsLockOn 성공시, 해당 값으로 변경', async () => {
      passwordStore.setIsPasswordConfirmCapsLockOn(true);
      expect(passwordStore.isPasswordConfirmCapsLockOn).toEqual(true);
    });
  });

  describe('setShowConfirmPassword() 테스트', () => {
    it('setShowConfirmPassword 성공시, 해당 값으로 변경', async () => {
      passwordStore.setShowConfirmPassword(true);
      expect(passwordStore.showConfirmPassword).toEqual(true);
    });
  });

  describe('setConfirmPassword() 테스트', () => {
    it('setConfirmPassword 성공시, 해당 값으로 변경', async () => {
      passwordStore.setConfirmPassword('test');
      expect(passwordStore.confirmPassword).toEqual('test');
    });
  });

  describe('setPassword() 테스트', () => {
    it('setPassword 성공시, 해당 값으로 변경', async () => {
      passwordStore.setPassword('testPassword');
      expect(passwordStore.password).toEqual('testPassword');
    });
  });

  describe('handleSubmitPassword() 테스트', () => {
    const mockSetPasswordFormInfo: SetPasswordFormInfo = {
      confirmPassword: 'testPassword',
      password: 'testPassword',
    };

    const mockFunction = jest.fn();

    let mockResult: BeApiResponse<SignUpResponse> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
      data: {
        idToken: 'token',
      },
    };

    describe('handleSubmitPassword() 테스트 - SignUp', () => {
      describe('handleSubmitPassword() 테스트 - unknown type', () => {
        beforeEach(() => {
          mockResult = {
            successOrNot: 'Y',
            statusCode: 'SUCCESS',
            data: {
              idToken: 'token',
            },
          };
          passwordStore.processType = ProcessType.SIGN_UP;
          passwordStore.signUpType = SignUpType.UNKNOWN;
        });

        it('handleSubmitPassword() 테스트 - unknown type fail', () => {
          passwordStore.callApiWithConfig = jest.fn().mockRejectedValue(mockResult);
          passwordStore.handleSubmitPassword(mockSetPasswordFormInfo, mockFunction);
          expect(passwordStore.callApiWithConfig).not.toHaveBeenCalled();
        });
      });
    });

    describe('handleSubmitPassword() 테스트 - unknown', () => {
      it('handleSubmitPassword() unknown 유형 테스트', () => {
        passwordStore.processType = ProcessType.UNKNOWN;
        passwordStore.callApiWithConfig = jest.fn().mockRejectedValue(mockResult);
        passwordStore.handleSubmitPassword(mockSetPasswordFormInfo, mockFunction);
        expect(passwordStore.callApiWithConfig).not.toHaveBeenCalled();
      });
    });

    describe('handleSubmitPassword() 테스트 - recoveryPassword', () => {
      let mockSetPasswordResult: BeApiResponse<SetPasswordResponse>;
      beforeEach(() => {
        passwordStore.processType = ProcessType.RECOVERY_PASSWORD;
        passwordStore.emailAddress = 'test@test.com';
        passwordStore.password = 'testPassword';
        passwordStore.sequenceNumber = 1;
        mockSetPasswordResult = {
          successOrNot: 'Y',
          statusCode: 'SUCCESS',
        };
        mockCommonToast.showToast.mockClear();
      });

      it('handleSubmitPassword() 테스트 success', async () => {
        passwordStore.callApiWithConfig = jest.fn().mockResolvedValue(mockSetPasswordResult);
        passwordStore.handleSubmitPassword(mockSetPasswordFormInfo, mockFunction);
        expect(passwordStore.callApiWithConfig).toHaveBeenCalled();
        expect(mockFunction).toHaveBeenCalled();
      });

      it('handleSubmitPassword() 테스트 success without callback', async () => {
        passwordStore.callApiWithConfig = jest.fn().mockResolvedValue(mockSetPasswordResult);
        await passwordStore.handleSubmitPassword(mockSetPasswordFormInfo);
        expect(passwordStore.callApiWithConfig).toHaveBeenCalled();
      });

      it('handleSubmitPassword() 테스트 fail', async () => {
        mockSetPasswordResult = {
          successOrNot: 'N',
          statusCode: 'FAIL',
        };

        passwordStore.callApiWithConfig = jest.fn().mockRejectedValue(mockSetPasswordResult);
        await passwordStore.handleSubmitPassword(mockSetPasswordFormInfo, mockFunction);
        expect(passwordStore.callApiWithConfig).toHaveBeenCalled();
        expect(mockCommonToast.showToast).toBeCalledTimes(1);
      });
    });

    describe('handleSubmitPassword() 테스트 - unlockMember', () => {
      let mockSetPasswordResult: BeApiResponse<SetPasswordResponse>;
      beforeEach(() => {
        passwordStore.processType = ProcessType.UNLOCK_MEMBER;
        passwordStore.emailAddress = 'test@test.com';
        passwordStore.password = 'testPassword';
        passwordStore.hash = 'hash';
        mockSetPasswordResult = {
          successOrNot: 'Y',
          statusCode: 'SUCCESS',
        };
        mockCommonToast.showToast.mockClear();
      });

      it('handleSubmitPassword() 테스트 success', async () => {
        passwordStore.callApiWithConfig = jest.fn().mockResolvedValue(mockSetPasswordResult);
        await passwordStore.handleSubmitPassword(mockSetPasswordFormInfo, mockFunction);
        expect(passwordStore.callApiWithConfig).toHaveBeenCalled();
        expect(mockFunction).toHaveBeenCalled();
      });

      it('handleSubmitPassword() 테스트 success without callback', async () => {
        passwordStore.callApiWithConfig = jest.fn().mockResolvedValue(mockSetPasswordResult);
        await passwordStore.handleSubmitPassword(mockSetPasswordFormInfo);
        expect(passwordStore.callApiWithConfig).toHaveBeenCalled();
      });

      it('handleSubmitPassword() 테스트 fail', async () => {
        mockSetPasswordResult = {
          successOrNot: 'N',
          statusCode: 'FAIL',
        };

        passwordStore.callApiWithConfig = jest.fn().mockRejectedValue(mockSetPasswordResult);
        await passwordStore.handleSubmitPassword(mockSetPasswordFormInfo, mockFunction);
        expect(passwordStore.callApiWithConfig).toHaveBeenCalled();
        expect(mockCommonToast.showToast).toBeCalledTimes(1);
      });

      it('handleSubmitPassword() 테스트 server fail', async () => {
        passwordStore.callApiWithConfig = jest.fn().mockResolvedValue({});
        await passwordStore.handleSubmitPassword(mockSetPasswordFormInfo, mockFunction);
        expect(passwordStore.callApiWithConfig).toHaveBeenCalled();
      });
    });
  });
});
