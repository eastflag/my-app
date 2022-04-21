import { ServiceTerm } from '../../terms/TermStore';

export enum UseType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
}

export enum SendType {
  SEND = 'SEND',
  RESEND = 'RESEND',
}

export interface Term {
  id: number;
  type: string;
  version: string;
  title: string;
  content: string;
}

export interface TermAgreement extends ServiceTerm {
  agree: boolean;
  agreeDatetime: Date | null;
}

export interface SignUpRequest {
  emailAddress: string;
  password: string;
  termAgreements: TermAgreement[];
  sequenceNumber: number;
  nickname: string;
  signUpType: SignUpType;
  snsType: string;
}

export enum ProcessType {
  SIGN_UP = 'signUp',
  RECOVERY_PASSWORD = 'recoveryPassword',
  UNLOCK_MEMBER = 'unlockMember',
  SIGN_IN = 'signIn',
  UNKNOWN = 'unknown',
}

export enum VerificationType {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export enum SignUpType {
  ID = 'ID',
  SNS = 'SNS',
  INTEGRATE = 'INTEGRATE',
  UNKNOWN = 'unknown',
}

export enum TwoFactorResultType {
  INCOMPLETE = 'incomplete',
  COMPLETE = 'complete',
}
export interface SetPasswordRequest {
  emailAddress?: string;
  sequenceNumber: number;
  password: string;
}

export interface MemberUnlockHashValidateRequest {
  emailAddress: string;
  hash: string;
}

export interface MemberUnlockRequest {
  emailAddress: string;
  password: string;
  hash: string;
}

export interface NicknameRequest {
  nickname: string;
}

export enum SnsType {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE',
  UNKNOWN = 'unknown',
}
