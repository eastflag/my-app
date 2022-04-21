import { action, makeObservable, observable } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import {
  TermAgreement,
  ProcessType,
  VerificationType,
  SignUpType,
  MemberUnlockHashValidateRequest,
} from './model/memberModel';
import { showToast } from '../../components/common/CommonToast';
import { t } from 'i18next';
import { ValidateMemberUnlockHashResponse } from '../../services/member/model/SetPassword';
import { memberServiceInstance } from '../../services/member/MemberService';
import { BeApiResponse } from '../../services/common/model/RestApi';

interface UnlockMemberQueryParams {
  emailAddress: string;
  hash: string;
}

export interface NavigationInfo {
  to?: string;
}

export class RecoveryPasswordComposedStore extends BaseStore {
  step: number = 0;
  emailAddress: string = '';
  processType: ProcessType = ProcessType.RECOVERY_PASSWORD;
  verificationType: VerificationType = VerificationType.EMAIL;
  signUpType: SignUpType = SignUpType.UNKNOWN;
  termAgreements: TermAgreement[] = [];
  verificationNumber: string = '';
  sequenceNumber: number = -1;
  isTermAgreed: boolean = false;
  termAgreeDatetime: Date | null = null;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      step: observable,
      emailAddress: observable,
      processType: observable,
      verificationType: observable,
      signUpType: observable,
      verificationNumber: observable,

      cleanUp: action,
      toNextStep: action,
      setEmailAddress: action,
      setProcessType: action,
      setVerificationType: action,
      setSignUpType: action,
      setVerificationNumber: action,
    });
  }

  cleanUp() {
    this.step = 0;
    this.emailAddress = '';
    this.processType = ProcessType.RECOVERY_PASSWORD;
    this.verificationType = VerificationType.EMAIL;
    this.signUpType = SignUpType.UNKNOWN;
    this.termAgreements = [];
    this.verificationNumber = '';
    this.sequenceNumber = -1;
    this.isTermAgreed = false;
    this.termAgreeDatetime = null;
  }

  toNextStep() {
    this.step += 1;
  }

  setEmailAddress(email: string) {
    this.emailAddress = email;
  }

  setSequenceNumber(sequenceNumber: number): void {
    this.sequenceNumber = sequenceNumber;
  }

  setProcessType(processType: ProcessType) {
    this.processType = processType;
  }

  setVerificationType(verificationType: VerificationType) {
    this.verificationType = verificationType;
  }

  setSignUpType(signUpType: SignUpType) {
    this.signUpType = signUpType;
  }

  setVerificationNumber(verificationNumber: string) {
    this.verificationNumber = verificationNumber;
  }

  async validateAndSetWithRecoveryPasswordQueryParams(queryParams: UnlockMemberQueryParams) {
    const { emailAddress, hash } = queryParams;

    const memberUnlockHashValidateRequset: MemberUnlockHashValidateRequest = {
      emailAddress,
      hash,
    };

    try {
      const result = await this.callApiWithState<BeApiResponse<ValidateMemberUnlockHashResponse>>(
        memberServiceInstance.validateMemberUnlockHash,
        memberUnlockHashValidateRequset
      );

      if (result?.successOrNot !== 'Y') {
        throw new Error(t('commonFail'));
      }
    } catch (error) {
      showToast(t('commonFail'));
    }
  }
}
