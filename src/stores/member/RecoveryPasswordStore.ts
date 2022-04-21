import { action, makeObservable, observable } from 'mobx';
import { BeApiResponse } from '../../services/common/model/RestApi';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { SendEmailResult } from '../../services/member/model/SendEmailResultModel';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import { Error, StatusCode } from '../../services/common/model/Error';
import { t } from 'i18next';
import { UseType, VerificationType, SendType, ProcessType } from './model/memberModel';

class RecoveryPasswordStore extends BaseStore {
  emailAddress: string = '';
  exceptionMessage: string = '';
  useType: UseType = UseType.SIGN_UP;
  verificationType: VerificationType = VerificationType.EMAIL;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      emailAddress: observable,
      exceptionMessage: observable,

      setEmailAddress: action,
      setExceptionMessage: action,
      setUseType: action,
      cleanUp: action,
    });
  }

  setEmailAddress(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  setExceptionMessage(exceptionMessage: string) {
    this.exceptionMessage = exceptionMessage;
  }

  setUseType(processType: string) {
    if (processType === ProcessType.SIGN_UP) {
      this.useType = UseType.SIGN_UP;
    } else if (processType === ProcessType.RECOVERY_PASSWORD) {
      this.useType = UseType.PASSWORD_CHANGE;
    }
  }

  cleanUp() {
    this.emailAddress = '';
    this.exceptionMessage = '';
    this.useType = UseType.SIGN_UP;
  }

  async sendEmailVerification() {
    try {
      const result = await this.callApiWithState<BeApiResponse<SendEmailResult>>(
        recoveryPasswordServiceInstance.sendEmailVerification,
        {
          sendTarget: this.emailAddress,
          sendType: SendType.SEND,
          verificationType: this.verificationType,
          useType: this.useType,
        }
      );

      if (result?.successOrNot === 'Y') {
        return true;
      }
    } catch (err: unknown) {
      const error = err as Error;

      switch (error.statusCode) {
        case StatusCode.MANDATORY_PARAM_ERR:
          this.exceptionMessage = t('member:recoveryPassword.errorMessage.mandatoryParameterError');
          break;
        case StatusCode.INVALID_FORMAT:
          this.exceptionMessage = t('member:recoveryPassword.errorMessage.invalidFormat');
          break;
        case StatusCode.INVALID_PARAMETER:
          this.exceptionMessage = t('member:recoveryPassword.errorMessage.invalidParameter');
          break;
        case StatusCode.NO_HAVE_SEND_DATA:
          this.exceptionMessage = t('member:recoveryPassword.errorMessage.noHaveSendData');
          break;
        default:
          this.exceptionMessage = t('member:signUp.signUp.errorMessage.unknownServer');
          break;
      }
      return false;
    }
    return false;
  }
}

export default RecoveryPasswordStore;
