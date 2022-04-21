import { action, makeObservable, observable } from 'mobx';
import { BeApiResponse } from '../../services/common/model/RestApi';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { SendEmailResult } from '../../services/member/model/SendEmailResultModel';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import { Error, StatusCode } from '../../services/common/model/Error';
import { t } from 'i18next';
import { showToast } from '../../components/common/CommonToast';
import { UseType, VerificationType } from './model/memberModel';

export default class SignUpFormStore extends BaseStore {
  emailAddress: string = '';

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      emailAddress: observable,

      setEmailAddress: action,
    });
  }

  setEmailAddress(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  async sendEmailVerification(emailAddress: string) {
    try {
      const result = await this.callApiWithState<BeApiResponse<SendEmailResult>>(
        recoveryPasswordServiceInstance.sendEmailVerification,
        {
          sendTarget: emailAddress,
          sendType: 'SEND',
          verificationType: VerificationType.EMAIL,
          useType: UseType.SIGN_UP,
        }
      );

      if (result?.successOrNot === 'Y') {
        return true;
      }
    } catch (err: unknown) {
      const error = err as Error;

      switch (error.statusCode) {
        case StatusCode.MANDATORY_PARAM_ERR:
          showToast(t('member:signUp.signUp.errorMessage.mandatoryParameterError'));
          break;
        case StatusCode.INVALID_FORMAT:
          showToast(t('member:signUp.signUp.errorMessage.invalidFormat'));
          break;
        case StatusCode.INVALID_PARAMETER:
          showToast(t('member:signUp.signUp.errorMessage.invalidParameter'));
          break;
        case StatusCode.NO_HAVE_SEND_DATA:
          showToast(t('member:signUp.signUp.errorMessage.noHaveSendData'));
          break;
        default:
          showToast(t('commonFail'));
          break;
      }
      return false;
    }
  }
}
