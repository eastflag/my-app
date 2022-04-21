export interface Login {
  emailAddress: string;
  password: string;
  captchaKey: string;
}

export interface TwoFactorLogin {
  emailAddress: string;
  password: string;
  sequenceNumber: number[];
}

export interface LoginSuccessResponse {
  idToken?: string;
  twoFactor?: string[];
}

export enum LoginErrorType {
  INVALID_MEMBER_INFORMATION = 'INVALID_MEMBER_INFORMATION',
  LOGIN_ATTEMPT_EXCEED = 'LOGIN_ATTEMPT_EXCEED',
  INVALID_CAPTCHA = 'INVALID_CAPTCHA',
  INVALID_MEMBER_TYPE = 'INVALID_MEMBER_TYPE',
  MEMBER_NOT_FOUND = 'MEMBER_NOT_FOUND',
}

export enum TwoFactorType {
  NONE = 'NONE',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  OTP = 'OTP',
}

export enum SnsResponseType {
  INTEGRATE = 'integrate',
  SIGNUP = 'signUp',
  SIGNIN = 'signIn',
}
