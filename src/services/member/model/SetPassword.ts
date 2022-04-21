export interface TokenResponse {
  idToken: string;
}

export interface SignUpResponse extends TokenResponse {}

export interface SetPasswordResponse extends TokenResponse {}

export interface ValidateMemberUnlockHashResponse {}
