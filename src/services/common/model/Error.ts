export interface Error {
  successOrNot: string;
  statusCode: string;
  data?: object;
}

export class StatusCode {
  public static readonly BAD_REQUEST_ERR = 'BAD_REQUEST_ERR';
  public static readonly DELETED_ACCOUNT = 'DELETED_ACCOUNT';
  public static readonly DORMANT_ACCOUNT = 'DORMANT_ACCOUNT';
  public static readonly DUPLICATION_DATA_ERR = 'DUPLICATION_DATA_ERR';
  public static readonly EXTERNAL_API_ERR = 'EXTERNAL_API_ERR';
  public static readonly FAIL = 'FAIL';
  public static readonly MANDATORY_PARAM_ERR = 'MANDATORY_PARAM_ERR';
  public static readonly NO_PROPER_RESPONSE = 'NO.PROPER.RESPONSE';
  public static readonly NO_RESPONSE = 'NO.RESPONSE';
  public static readonly NOT_FOUND_ERR = 'NOT.FOUND.ERR';
  public static readonly PARAMETER_VALUE_ERR = 'PARAMETER.VALUE.ERR';
  public static readonly SUCCESS = 'SUCCESS';
  public static readonly UNAUTHORIZED_ERR = 'UNAUTHORIZED.ERR';
  public static readonly UNKNOWN_SERVER = 'UNKNOWN.SERVER';
  public static readonly DELETE_FAIL = 'DELETE.FAIL';
  public static readonly INVALID_CHANGE_REQUEST = 'INVALID.CHANGE.REQUEST';
  public static readonly UPDATE_FAIL = 'UPDATE.FAIL';
  public static readonly CLIENT_CLOSE_REQUEST = 'CLIENT.CLOSE.REQUEST';
  public static readonly INVALID_FORMAT = 'INVALID_FORMAT';
  public static readonly INVALID_PARAMETER = 'INVALID_PARAMETER';
  public static readonly NO_HAVE_SEND_DATA = 'NO_HAVE_SEND_DATA';
  public static readonly PARAM_LENGTH_ERR = 'PARAM_LENGTH_ERR';
  public static readonly INVALID_VERIFICATION_NUMBER = 'INVALID_VERIFICATION_NUMBER';
  public static readonly DUPLICATED_NICKNAME = 'DUPLICATED_NICKNAME';
}
