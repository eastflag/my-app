export interface Integrate {
  emailAddress: string;
  sequenceNumber: string;
}

export interface IntegateSuccessResponse {
  idToken?: string;
  twoFactor?: string[];
}

export enum IntegrateErrorType {
  INVALID_MEMBER_INFORMATION = 'INVALID_MEMBER_INFORMATION',
}
