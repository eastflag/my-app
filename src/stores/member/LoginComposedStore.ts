import { action, makeObservable, observable } from 'mobx';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { loginServiceInstance } from '../../services/member/LoginService';
import { integrateServiceInstance } from '../../services/member/IntegrateService';
import { IntegateSuccessResponse, IntegrateErrorType } from '../../services/member/model/IntegrateMember';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { showToast } from '../../components/common/CommonToast';
import { t } from 'i18next';
import {
  ProcessType,
  SnsType,
  SignUpType,
  SendType,
  UseType,
  VerificationType,
  TwoFactorResultType,
} from './model/memberModel';
import { sessionStorageServiceInstance } from '../../services/common/SessionStorageService';
import { recoveryPasswordServiceInstance } from '../../services/member/RecoveryPasswordService';
import { SendEmailResult } from '../../services/member/model/SendEmailResultModel';
import { Error, StatusCode } from '../../services/common/model/Error';
import { LoginSuccessResponse } from '../../services/member/model/Login';

export class LoginComposedStore extends BaseStore {
  step: number = 0;
  emailAddress: string = '';
  password: string = '';
  processType: ProcessType = ProcessType.SIGN_IN;
  signUpType: SignUpType = SignUpType.ID;
  verificationNumber: string = '';
  verificationType: VerificationType = VerificationType.EMAIL;
  twoFactorList: string[] = [];
  sequenceNumber: number[] = [];
  progressBar: number = 0;
  snsType: SnsType = SnsType.UNKNOWN;
  snsLoginSequenceNumber: string = '';
  integrateComplete: boolean = false;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      step: observable,
      emailAddress: observable,
      password: observable,
      processType: observable,
      signUpType: observable,
      verificationNumber: observable,
      sequenceNumber: observable,
      progressBar: observable,
      twoFactorList: observable,
      verificationType: observable,
      snsLoginSequenceNumber: observable,
      snsType: observable,
      integrateComplete: observable,
      cleanUp: action.bound,
      toNextStep: action.bound,
      setStep: action.bound,
      setEmailAddress: action.bound,
      setPassword: action.bound,
      setSnsType: action.bound,
      setProcessType: action.bound,
      setSignUpType: action.bound,
      setVerificationNumber: action.bound,
      setSequenceNumber: action.bound,
      setSnsLoginSequenceNumber: action.bound,
      setProgressBar: action.bound,
      setTwoFactorList: action.bound,
      twoFactorLogin: action.bound,
      processTwoFactorSignIn: action.bound,
      sendVerification: action.bound,
      setVerificationType: action.bound,
      setIntegrateComplete: action.bound,
      integrateMember: action.bound,
    });
  }

  cleanUp(
    initialValues: {
      step?: number;
      processType?: ProcessType;
      verificationType?: VerificationType;
      signUpType?: SignUpType;
      emailAddress?: string;
      progressBar?: number;
    } = {}
  ) {
    const { step = 0, signUpType = SignUpType.ID, emailAddress = '', progressBar = 0 } = initialValues;
    this.step = step;
    this.emailAddress = emailAddress;
    this.password = '';
    this.processType = ProcessType.SIGN_IN;
    this.verificationType = VerificationType.EMAIL;
    this.signUpType = signUpType;
    this.progressBar = 0;
  }

  setStep(step: number) {
    this.step = step;
  }

  toNextStep() {
    if (isNaN(this.step)) {
      this.step = 0;
    } else {
      this.step++;
    }
  }

  setEmailAddress(email: string) {
    this.emailAddress = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setProcessType(processType: ProcessType) {
    this.processType = processType;
  }

  setSignUpType(signUpType: SignUpType) {
    this.signUpType = signUpType;
  }

  setVerificationNumber(verificationNumber: string) {
    this.verificationNumber = verificationNumber;
  }
  setIntegrateComplete(integrateComplete: boolean) {
    this.integrateComplete = integrateComplete;
  }

  setSequenceNumber(sequenceNumber: number) {
    this.sequenceNumber.push(sequenceNumber);
  }

  setSnsType(snsType: SnsType) {
    this.snsType = snsType;
  }

  setSnsLoginSequenceNumber(snsLoginsequenceNumber: string) {
    this.snsLoginSequenceNumber = snsLoginsequenceNumber;
  }

  setTwoFactorList(twoFactorList: string[]) {
    this.twoFactorList = twoFactorList;
  }

  setProgressBar(progressBar: number) {
    this.progressBar = progressBar;
  }

  setVerificationType(verificationType: VerificationType) {
    this.verificationType = verificationType;
  }

  async twoFactorLogin() {
    try {
      const result = await this.callApiWithConfig<BeApiResponse<LoginSuccessResponse>>(
        loginServiceInstance.requestTwoFactorLogin,
        {
          emailAddress: this.emailAddress,
          password: this.password,
          sequenceNumber: this.sequenceNumber,
          twoFactor: this.twoFactorList,
          signUpType: this.signUpType,
        }
      );

      /* istanbul ignore else */
      if (result?.successOrNot === 'Y' && result?.data) {
        /* istanbul ignore else */
        if (result.data.idToken) this.root?.sessionStore.setIdToken(result.data.idToken);
        return true;
      }
    } catch (err: unknown) {
      const error = err as Error;
      switch (error.statusCode) {
        case IntegrateErrorType.INVALID_MEMBER_INFORMATION:
          showToast(t('member:signUp.signUp.integrateMember:invalidMemberInformation'));
          break;
        default:
          showToast(t('member:signUp.signUp.errorMessage.unknownServer'));
          break;
      }
      this.sequenceNumber.pop();
      return false;
    }
  }

  async sendVerification() {
    try {
      const result = await this.callApiWithState<BeApiResponse<SendEmailResult>>(
        recoveryPasswordServiceInstance.sendEmailVerification,
        {
          useType: UseType.SIGN_IN,
          sendType: SendType.SEND,
          sendTarget: this.emailAddress,
          verificationType: this.verificationType,
        }
      );

      /* istanbul ignore else */
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
          showToast(t('member:signUp.signUp.errorMessage.unknownServer'));
          break;
      }
      return false;
    }
  }

  async processTwoFactorSignIn() {
    if (this.twoFactorList.length === this.step) {
      const result = await this.twoFactorLogin();
      if (result) return TwoFactorResultType.COMPLETE;
      else return TwoFactorResultType.INCOMPLETE;
    } else {
      this.setVerificationType(this.twoFactorList[this.step] as VerificationType);
      this.toNextStep();
      const result = await this.sendVerification();

      if (this.twoFactorList.length === 2) {
        this.step === 1 ? this.setProgressBar(50) : this.setProgressBar(100);
      } else if (this.twoFactorList.length === 3) {
        this.step === 1
          ? this.setProgressBar(33.3)
          : this.step === 2
          ? this.setProgressBar(66.6)
          : this.setProgressBar(100);
      } else {
        this.setProgressBar(0);
      }

      return TwoFactorResultType.INCOMPLETE;
    }
  }

  async integrateMember() {
    try {
      const result = await this.callApiWithConfig<BeApiResponse<IntegateSuccessResponse>>(
        integrateServiceInstance.integrateMember,
        {
          emailAddress: this.emailAddress,
          sequenceNumber: this.snsLoginSequenceNumber,
        },
        {
          withDimmed: true,
        }
      );

      if (result?.successOrNot === 'Y' && result?.data) {
        if (result.data.twoFactor) {
          this.setTwoFactorList(result.data.twoFactor);
          this.setSignUpType(SignUpType.INTEGRATE);
          this.setProcessType(ProcessType.SIGN_IN);
          this.setIntegrateComplete(true);
        } else {
          /* istanbul ignore else */
          if (result.data.idToken) {
            this.root?.sessionStore.setIdToken(result.data.idToken);
            this.setIntegrateComplete(true);
          }
        }
      }
    } catch (error: InstanceType<Error> | BeApiResponse<string>) {
      const checkError: BeApiResponse<string> = error as BeApiResponse<string>;
      switch (checkError.statusCode) {
        case IntegrateErrorType.INVALID_MEMBER_INFORMATION:
          showToast(t('member:signUp.signUp.integrateMember.invalidMemberInformation'));
          break;
        default:
          showToast(t('commonFail'));
          break;
      }
    }
  }
}

export default LoginComposedStore;
