export interface CommonCodeRequest {
  groupCodeId: string;
}
export interface CommonCodeResponse {
  codeId: string;
  codeName: string;
}
export interface CommonCode extends CommonCodeResponse {}
