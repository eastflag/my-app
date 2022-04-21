import { action, makeObservable, observable } from 'mobx';
import RootStore from '../Store';
import BaseStore from '../BaseStore';
import { SetPasswordResponse, SignUpResponse } from '../../services/member/model/SetPassword';
import { memberServiceInstance } from '../../services/member/MemberService';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { PropsWithChildren } from 'react';
import { SignUpComposedStore } from './SignUpComposedStore';
import { t } from 'i18next';
import { showToast } from '../../components/common/CommonToast';
import {
  ProcessType,
  SetPasswordRequest,
  MemberUnlockRequest,
  SignUpRequest,
  SignUpType,
  TermAgreement,
} from './model/memberModel';
import { SetPasswordFormInfo } from '../../pages/member/components/SetPasswordForm';
export interface SignUpFormProps extends PropsWithChildren<object> {
  storeProps?: SignUpComposedStore;
}

class PasswordStore extends BaseStore {
  signUpType = SignUpType.UNKNOWN;
  emailAddress = '';
  confirmPassword = '';
  password = '';
  snsType = '';
  sequenceNumber = -1;
  processType = '';
  showPassword = false;
  showConfirmPassword = false;
  isPasswordCapsLockOn = false;
  isPasswordConfirmCapsLockOn = false;
  termAgreements: TermAgreement[] = [];
  hash: string = '';

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      signUpType: observable,
      emailAddress: observable,
      password: observable,
      confirmPassword: observable,
      termAgreements: observable,
      sequenceNumber: observable,
      processType: observable,
      showPassword: observable,
      showConfirmPassword: observable,
      isPasswordCapsLockOn: observable,
      isPasswordConfirmCapsLockOn: observable,
      hash: observable,

      setShowPassword: action,
      setShowConfirmPassword: action,
      handleSubmitPassword: action,
      setIsPasswordCapsLockOn: action,
      setIsPasswordConfirmCapsLockOn: action,
    });
  }

  cleanup = () => {
    this.signUpType = SignUpType.UNKNOWN;
    this.emailAddress = '';
    this.confirmPassword = '';
    this.password = '';
    this.sequenceNumber = -1;
    this.processType = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
    this.isPasswordCapsLockOn = false;
    this.isPasswordConfirmCapsLockOn = false;
    this.termAgreements = [];
  };

  setShowPassword = (showPassword: boolean) => {
    this.showPassword = showPassword;
  };

  setIsPasswordCapsLockOn = (isPasswordCapsLockOn: boolean) => {
    this.isPasswordCapsLockOn = isPasswordCapsLockOn;
  };

  setIsPasswordConfirmCapsLockOn = (isPasswordConfirmCapsLockOn: boolean) => {
    this.isPasswordConfirmCapsLockOn = isPasswordConfirmCapsLockOn;
  };

  setShowConfirmPassword = (showConfirmPassword: boolean) => {
    this.showConfirmPassword = showConfirmPassword;
  };

  setConfirmPassword = (confirmPassword: string) => {
    this.confirmPassword = confirmPassword;
  };

  setPassword = (password: string) => {
    this.password = password;
  };

  // eslint-disable-next-line  @typescript-eslint/ban-types
  async handleSubmitPassword(values: SetPasswordFormInfo, handleSuccess?: Function | undefined) {
    try {
      if (this.processType === ProcessType.SIGN_UP) {
        this.root?.signUpComposedStore.setPassword(values.password);
        if (handleSuccess) handleSuccess();
      } else if (this.processType === ProcessType.RECOVERY_PASSWORD) {
        const setPasswordRequest: SetPasswordRequest = {
          emailAddress: this.emailAddress,
          password: values.password,
          sequenceNumber: this.sequenceNumber,
        };

        const result = await this.callApiWithConfig<BeApiResponse<SetPasswordResponse>>(
          memberServiceInstance.setPassword,
          setPasswordRequest,
          {
            withDimmed: true,
          }
        );

        if (result && result.successOrNot === 'Y') {
          if (handleSuccess) {
            handleSuccess();
          }
        }
      } else if (this.processType === ProcessType.UNLOCK_MEMBER) {
        const setPasswordWithHashRequest: MemberUnlockRequest = {
          emailAddress: this.emailAddress,
          password: values.password,
          hash: this.hash,
        };

        const result = await this.callApiWithConfig<BeApiResponse<SetPasswordResponse>>(
          memberServiceInstance.unlockMember,
          setPasswordWithHashRequest,
          {
            withDimmed: true,
          }
        );

        if (result && result.successOrNot === 'Y') {
          if (handleSuccess) {
            handleSuccess();
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast(t('commonFail'));
    }
  }
}

export default PasswordStore;
