import { action, computed, makeObservable, observable } from 'mobx';
import { BeApiResponse } from '../../services/common/model/RestApi';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { showToast } from '../../components/common/CommonToast';
import { ServiceTerm, TermType } from '../terms/TermStore';
import { t } from 'i18next';
import { ProcessType, VerificationType, SignUpType, TermAgreement, SignUpRequest } from './model/memberModel';
import { memberServiceInstance } from '../../services/member/MemberService';
import { SignUpResponse } from '../../services/member/model/SetPassword';
import { StatusCode } from '../../services/common/model/Error';

export interface SnsLoginQueryResponse {
  idToken?: string;
  emailAddress?: string;
  type?: string;
  sequenceNumber?: string;
}

export enum SnsLoginType {
  INTEGRATE = 'integrate',
  SIGNUP = 'signUp',
  SIGNIN = 'signIn',
}

export interface NavigationAdditionalInfo {
  emailAddress?: string;
  sequenceNumber?: string;
}
export interface NavigationInfo {
  to?: string;
  additionalInfo?: NavigationAdditionalInfo;
}

export enum SnsType {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  UNKNOWN = 'unknown',
}

export class SignUpComposedStore extends BaseStore {
  step: number = 0;

  emailAddress: string = '';
  password: string = '';
  confirmPassword: string = '';
  processType: ProcessType = ProcessType.SIGN_UP;
  verificationType: VerificationType = VerificationType.EMAIL;
  nickname: string = '';
  signUpType: SignUpType = SignUpType.ID;
  snsType: SnsType = SnsType.UNKNOWN;
  verificationNumber: string = '';
  isTermAgreed: boolean = false;
  termAgreeDatetime: Date | null = null;
  sequenceNumber: number = -1;
  snsLoginSequenceNumber: string = '';
  isNicknameDuplicated: boolean = false;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      step: observable,

      emailAddress: observable,
      password: observable,
      confirmPassword: observable,
      processType: observable,
      verificationType: observable,
      nickname: observable,
      signUpType: observable,
      snsType: observable,
      verificationNumber: observable,
      isTermAgreed: observable,
      termAgreeDatetime: observable,
      sequenceNumber: observable,
      snsLoginSequenceNumber: observable,
      isNicknameDuplicated: observable,

      cleanUp: action.bound,

      toNextStep: action.bound,

      setStep: action.bound,
      setEmailAddress: action.bound,
      setPassword: action.bound,
      setConfirmPassword: action.bound,
      setProcessType: action.bound,
      setVerificationType: action.bound,
      setNickname: action.bound,
      setSignUpType: action.bound,
      setSnsType: action.bound,
      setVerificationNumber: action.bound,
      setIsTermAgreed: action.bound,
      setTermAgreeDateTime: action.bound,
      setSequenceNumber: action.bound,
      setSnsLoginSequenceNumber: action.bound,
      setIsNicknameDuplicated: action.bound,

      signUpSnsAgreeTermAndSubmit: action.bound,
      signUpSubmit: action.bound,

      termAgreements: computed,
    });
  }

  cleanUp(
    initialValues: {
      step?: number;
      processType?: ProcessType;
      verificationType?: VerificationType;
      signUpType?: SignUpType;
      snsType?: SnsType;
      emailAddress?: string;
      snsLoginSequenceNumber?: string;
    } = {}
  ) {
    const {
      step = 0,
      signUpType = SignUpType.UNKNOWN,
      snsType = SnsType.UNKNOWN,
      emailAddress = '',
      snsLoginSequenceNumber = '',
    } = initialValues;
    this.step = step;

    this.emailAddress = emailAddress;
    this.password = '';
    this.confirmPassword = '';
    this.processType = ProcessType.SIGN_UP;
    this.verificationType = VerificationType.EMAIL;
    this.nickname = '';
    this.signUpType = signUpType;
    this.snsType = snsType;
    this.isTermAgreed = false;
    this.termAgreeDatetime = null;
    this.snsLoginSequenceNumber = snsLoginSequenceNumber;
    this.isNicknameDuplicated = false;
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

  setConfirmPassword(confirmPassword: string) {
    this.confirmPassword = confirmPassword;
  }

  setProcessType(processType: ProcessType) {
    this.processType = processType;
  }
  setVerificationType(verificationType: VerificationType) {
    this.verificationType = verificationType;
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
  }

  setSignUpType(signUpType: SignUpType) {
    this.signUpType = signUpType;
  }

  setSnsType(snsType: SnsType) {
    this.snsType = snsType;
  }

  setVerificationNumber(verificationNumber: string) {
    this.verificationNumber = verificationNumber;
  }

  setIsTermAgreed(isTermAgreed: boolean) {
    this.isTermAgreed = isTermAgreed;
  }

  setTermAgreeDateTime(termAgreeDatetime: Date | null) {
    this.termAgreeDatetime = termAgreeDatetime;
  }

  setSequenceNumber(sequenceNumber: number) {
    this.sequenceNumber = sequenceNumber;
  }

  setSnsLoginSequenceNumber(snsLoginsequenceNumber: string) {
    this.snsLoginSequenceNumber = snsLoginsequenceNumber;
  }

  setIsNicknameDuplicated(isNicknameDuplicated: boolean) {
    this.isNicknameDuplicated = isNicknameDuplicated;
  }

  getNavigationInfoWithSnsLogin(queryParams: SnsLoginQueryResponse) {
    const navigationInfo: NavigationInfo = {};
    if (queryParams.idToken) {
      this.root?.sessionStore.setIdToken(queryParams.idToken);
    }

    switch (queryParams.type) {
      case SnsLoginType.INTEGRATE:
        navigationInfo.additionalInfo = {
          emailAddress: queryParams.emailAddress,
          sequenceNumber: queryParams.sequenceNumber,
        };
        navigationInfo.to = '/signUp/integrate';
        break;
      case SnsLoginType.SIGNUP:
        navigationInfo.additionalInfo = {
          emailAddress: queryParams.emailAddress,
          sequenceNumber: queryParams.sequenceNumber,
        };
        navigationInfo.to = '/signUp/sns';
        break;
      case SnsLoginType.SIGNIN:
        navigationInfo.to = '/main';
        break;
      default:
        break;
    }
    return navigationInfo;
  }

  get termAgreements(): TermAgreement[] {
    if (this.root && this.root.termStore) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return [TermType.SERVICE, TermType.PRIVACY]
        .map((termType: TermType) => this.root?.termStore.getLatestTermByType(termType))
        .map(
          (term: ServiceTerm | undefined) =>
            term && {
              ...term,
              agree: this.isTermAgreed,
              agreeDatetime: this.termAgreeDatetime,
            }
        )
        .filter(Boolean) as TermAgreement[];
    } else {
      return [];
    }
  }

  async signUpSnsAgreeTermAndSubmit() {
    this.termAgreeDatetime = new Date();
    this.isTermAgreed = true;
    this.toNextStep();
  }

  async signUpSubmit() {
    try {
      const signUpRequest: SignUpRequest = {
        emailAddress: this.emailAddress,
        password: this.password,
        termAgreements: this.termAgreements,
        sequenceNumber: this.sequenceNumber,
        nickname: this.nickname,
        signUpType: this.signUpType,
        snsType: this.snsType,
      };

      const result = await this.callApiWithConfig<BeApiResponse<SignUpResponse>>(
        memberServiceInstance.signUp,
        signUpRequest,
        {
          withDimmed: true,
        }
      );

      if (result && result.successOrNot === 'Y' && result.data) {
        this.root?.sessionStore.setIdToken(result.data.idToken);
        this.toNextStep();
      }
    } catch (error: unknown) {
      const errorInfo: BeApiResponse<string | null> = error as BeApiResponse<string | null>;
      if (errorInfo.statusCode === StatusCode.DUPLICATED_NICKNAME) {
        this.setIsNicknameDuplicated(true);
        showToast(t('member:signUp.signUp.errorMessage.duplicatedNickname'));
      } else {
        showToast(t('commonFail'));
      }
      return;
    }
  }
}

export default SignUpComposedStore;
