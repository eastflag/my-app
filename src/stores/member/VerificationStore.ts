import { action, computed, makeObservable, observable } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { VerificationResult } from '../../services/member/model/VerificationResultModel';
import { SendEmailResult } from '../../services/member/model/SendEmailResultModel';
import { verificationServiceInstance } from '../../services/member/VerificationService';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import { Error, StatusCode } from '../../services/common/model/Error';
import { t } from 'i18next';
import { UseType, SendType, VerificationType, ProcessType, SignUpType } from './model/memberModel';

export enum DisplayType {
  VERIFICATION = 'Verification',
  ACCOUNTEXIST = 'AccountExist',
  NOACCOUNT = 'NoAccount',
}

class VerificationStore extends BaseStore {
  processType: string = '';
  verificationType: VerificationType = VerificationType.EMAIL;
  emailAddress: string = '';
  verificationNumber: string = '';
  disableResend: boolean = false;
  alertMessage: string = '';
  alertSeverity: string = '';
  failCount: number = 0;
  maxFailCount: number = 5;
  verifyAndEmailExist: boolean = false;
  memberJoinType: string = '';
  startTime: number = 180000;
  countdownTime: number = Date.now() + this.startTime;
  needClearAndFocusVerificationNumber: boolean = false;
  goNextStep: boolean = false;
  exceptionMessage: string = '';
  useType: UseType = UseType.SIGN_UP;
  displayType: DisplayType = DisplayType.VERIFICATION;
  navigateUrl?: string;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      processType: observable,
      verificationType: observable,
      emailAddress: observable,
      verificationNumber: observable,
      disableResend: observable,
      alertMessage: observable,
      alertSeverity: observable,
      failCount: observable,
      maxFailCount: observable,
      verifyAndEmailExist: observable,
      memberJoinType: observable,
      countdownTime: observable,
      displayType: observable,

      checkVerificationNumber: action,
      resendCode: action,
      setAlertMessage: action,
      resetAlertMessage: action,
      resetVerificationNumber: action,
      setVerifyAndEmailExists: action,
      setProcessType: action,
      setVerificationType: action,
      setEmailAddress: action,
      setVerificationNumber: action,
      setCountdownTime: action,
      setNeedClearAndFocusVerificationNumber: action,
      setDisplayType: action,
      setUseType: action,
      setDisableResend: action,
      setExceptionMessage: action,
      setNavigateUrl: action,
      setFailCount: action,
      cleanUp: action,

      isTooManyFailed: computed,
    });
  }

  setUseType(processType: ProcessType) {
    if (processType === ProcessType.SIGN_UP) {
      this.useType = UseType.SIGN_UP;
    } else if (processType === ProcessType.RECOVERY_PASSWORD) {
      this.useType = UseType.PASSWORD_CHANGE;
    } else if (processType === ProcessType.SIGN_IN) {
      this.useType = UseType.SIGN_IN;
    }
  }

  setDisableResend(disableResend: boolean) {
    this.disableResend = disableResend;
  }

  cleanUp() {
    this.verificationNumber = '';
    this.emailAddress = '';
    this.useType = UseType.SIGN_UP;
    this.verificationType = VerificationType.EMAIL;
    this.goNextStep = false;
    this.needClearAndFocusVerificationNumber = false;
    this.exceptionMessage = '';
    this.displayType = DisplayType.VERIFICATION;
    this.alertMessage = '';
    this.memberJoinType = '';
    this.verifyAndEmailExist = false;
    this.navigateUrl = undefined;
    this.failCount = 0;
  }

  async checkVerificationNumber() {
    try {
      const result = await this.callApiWithState<BeApiResponse<VerificationResult>>(
        verificationServiceInstance.checkVerificationNumber,
        {
          sendTarget: this.emailAddress,
          verificationNumber: this.verificationNumber,
          verificationType: this.verificationType,
          useType: this.useType,
        }
      );

      if (result?.successOrNot === 'Y' && result?.data?.verificationNumberMatchYn === 'Y') {
        if (this.processType === ProcessType.SIGN_IN) {
          this.goNextStep = true;
          return result?.data?.sequenceNumber;
        }

        if (result?.data?.memberJoinYn === 'N') {
          if (this.processType === ProcessType.SIGN_UP) {
            this.goNextStep = true;
            this.setDisplayType(DisplayType.VERIFICATION);
          } else {
            this.setDisplayType(DisplayType.NOACCOUNT);
          }
        } else if (result?.data?.memberJoinYn === 'Y') {
          if (result?.data?.memberJoinType == SignUpType.SNS) {
            this.setVerifyAndEmailExists(true, result?.data?.memberJoinType);
            this.setDisplayType(DisplayType.ACCOUNTEXIST);
          } else if (
            result?.data?.memberJoinType == SignUpType.ID ||
            result?.data?.memberJoinType == SignUpType.INTEGRATE
          ) {
            if (this.processType === ProcessType.SIGN_UP) {
              this.setVerifyAndEmailExists(true, result?.data?.memberJoinType);
              this.setDisplayType(DisplayType.ACCOUNTEXIST);
            } else {
              this.goNextStep = true;
            }
          }
        }
        return result?.data?.sequenceNumber;
      } else if (result?.successOrNot === 'Y' && result?.data?.verificationNumberMatchYn === 'N') {
        const verificationNumberWrongCount = result?.data?.verificationNumberWrongCount;
        this.increaseFailCount();

        if (verificationNumberWrongCount > 0 && verificationNumberWrongCount < this.maxFailCount) {
          this.setAlertMessage('error', t('member:signUp.verification.msgInvalidCode'));
          this.resetVerificationNumber();
          this.needClearAndFocusVerificationNumber = true;
        } else if (verificationNumberWrongCount >= this.maxFailCount) {
          if (this.processType === ProcessType.SIGN_IN) {
            this.setAlertMessage('error', t('member:login.errorMessage.tooManyFailedAttempts'));
            this.needClearAndFocusVerificationNumber = true;
          } else {
            this.exceptionMessage = t('member:signUp.verification.errorMessage.tooManyFailedAttempts');
            if (this.processType === ProcessType.SIGN_UP) {
              this.setNavigateUrl('/signUp');
            } else if (this.processType === ProcessType.RECOVERY_PASSWORD) {
              this.setNavigateUrl('/login');
            }
          }
        }
        this.setDisplayType(DisplayType.VERIFICATION);
        return -1;
      }
    } catch (err: unknown) {
      const error = err as Error;

      switch (error.statusCode) {
        case StatusCode.MANDATORY_PARAM_ERR:
          this.exceptionMessage = t('member:signUp.verification.errorMessage.mandatoryParameterError');
          break;
        case StatusCode.INVALID_FORMAT:
          this.exceptionMessage = t('member:signUp.verification.errorMessage.invalidFormat');
          break;
        case StatusCode.INVALID_PARAMETER:
          this.exceptionMessage = t('member:signUp.verification.errorMessage.invalidParameter');
          break;
        case StatusCode.NO_HAVE_SEND_DATA:
          this.exceptionMessage = t('member:signUp.verification.errorMessage.noHaveSendData');
          break;
        case StatusCode.PARAM_LENGTH_ERR:
          this.exceptionMessage = t('member:signUp.verification.errorMessage.paramLengthError');
          break;
        case StatusCode.INVALID_VERIFICATION_NUMBER:
          this.setAlertMessage('error', t('member:signUp.verification.msgInvalidCode'));
          this.resetVerificationNumber();
          this.needClearAndFocusVerificationNumber = true;
          break;
        default:
          this.exceptionMessage = t('member:signUp.signUp.errorMessage.unknownServer');
          break;
      }
    }
  }

  // eslint-disable-next-line  @typescript-eslint/ban-types
  async resendCode() {
    try {
      this.setDisableResend(true);

      const result = await this.callApiWithState<BeApiResponse<SendEmailResult>>(
        recoveryPasswordServiceInstance.sendEmailVerification,
        {
          sendTarget: this.emailAddress,
          sendType: SendType.RESEND,
          verificationType: this.verificationType,
          useType: this.useType,
        }
      );

      /* istanbul ignore else */
      if (result?.successOrNot === 'Y') {
        this.setCountdownTime(Date.now() + 180000);
        this.resetVerificationNumber();
        this.resetAlertMessage();
        this.needClearAndFocusVerificationNumber = true;
      }
      return true;
    } catch (err: unknown) {
      const error = err as Error;

      switch (error.statusCode) {
        case 'MANDATORY_PARAM_ERR':
          this.exceptionMessage = t('member:signUp.verification.errorMessage.mandatoryParameterError');
          break;
        case 'INVALID_FORMAT':
          this.exceptionMessage = t('member:signUp.verification.errorMessage.invalidFormat');
          break;
        case 'INVALID_PARAMETER':
          this.exceptionMessage = t('member:signUp.verification.errorMessage.invalidParameter');
          break;
        case 'INVALID_RESEND_COUNT_LIMIT':
          this.setAlertMessage('error', t('member:signUp.verification:msgTooManyAttempts'));
          this.resetVerificationNumber();
          this.needClearAndFocusVerificationNumber = true;
          break;
        default:
          this.exceptionMessage = t('member:signUp.signUp.errorMessage.unknownServer');
          break;
      }
      return false;
    } finally {
      setTimeout(() => {
        this.setDisableResend(false);
      }, 1000);
    }
  }

  setAlertMessage(alertSeverity: string, alertMessage: string) {
    this.alertSeverity = alertSeverity;
    this.alertMessage = alertMessage;
  }

  resetAlertMessage() {
    this.alertMessage = '';
  }

  setVerificationNumber(verificationNumber: string) {
    this.verificationNumber = verificationNumber;
  }

  resetVerificationNumber() {
    this.verificationNumber = '';
  }

  increaseFailCount() {
    this.failCount++;
  }

  setVerifyAndEmailExists(verifyAndEmailExist: boolean, memberJoinType: string) {
    this.verifyAndEmailExist = verifyAndEmailExist;
    this.memberJoinType = memberJoinType;
  }

  setProcessType(processType: string) {
    this.processType = processType;
  }

  setVerificationType(verificationType: VerificationType) {
    this.verificationType = verificationType;
  }

  setEmailAddress(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  setCountdownTime(countdownTime: number) {
    this.countdownTime = countdownTime;
  }

  setDisplayType(displayType: DisplayType) {
    this.displayType = displayType;
  }

  setNeedClearAndFocusVerificationNumber(needClearAndFocusVerificationNumber: boolean) {
    this.needClearAndFocusVerificationNumber = needClearAndFocusVerificationNumber;
  }

  setExceptionMessage(exceptionMessage: string) {
    this.exceptionMessage = exceptionMessage;
  }

  setNavigateUrl(navigateUrl?: string) {
    this.navigateUrl = navigateUrl;
  }
  setFailCount(failCount: number) {
    this.failCount = failCount;
  }

  get isTooManyFailed() {
    return this.failCount >= this.maxFailCount;
  }
}

export default VerificationStore;
