import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Service, LocalServicePort } from './model/Service';
import { Error, StatusCode } from './model/Error';
import { Status } from './model/Status.enum';
import { v4 as uuidv4 } from 'uuid';
import { BeApiRequest } from './model/RestApi';
import { sessionStorageServiceInstance } from './SessionStorageService';

export default class BaseService {
  private environment: string;
  private apiLocation: string;
  private protocol = 'https://';
  // private languageCode = sessionStorage.getItem('lang') ? sessionStorage.getItem('lang') : 'ko';
  // protected sessionService = sessionServiceInstance;
  protected defaultPagingSize = 10;

  constructor() {
    this.apiLocation = process.env.REACT_APP_API_URL || '';
    this.environment = process.env.REACT_APP_NODE_ENV || '';
  }

  public getAPILocation = (): string => {
    return this.apiLocation;
  };

  public setEnvironment = (env: string): void => {
    this.environment = env;
  };

  protected getCorrelationId = () => ({
    correlationId:
      window.location.pathname === '/'
        ? 'root'.concat('_').concat(uuidv4())
        : window.location.pathname.concat('_').concat(uuidv4()), // 화면 경로 + uuid
  });

  protected headers = {
    Accept: 'application/json',
    // Authorization: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia',
    'Content-Type': 'application/json',
    'X-Correlation-Id': '', // header 규칙 확인
    // 'Correlation-Object': '',
    'X-Language-Code': 'EN',
    // 'X-Session-Id': '',
    // 'X-Common-Info': '',
    // Pragma: 'no-cache',
  };

  protected config: AxiosRequestConfig = {
    method: 'GET',
    url: '',
    headers: this.headers,
    data: {},
  };

  private configInit() {
    const correlationId = JSON.stringify(this.getCorrelationId());
    const idToken = sessionStorageServiceInstance.getIdToken();
    // const commonInfo = JSON.stringify({
    //   bizType: this.sessionService.getSessionInfo().bizType,
    // });
    if (!this.config.headers) this.config.headers = {};
    this.config.headers['X-Correlation-Id'] = correlationId;
    if (idToken) {
      this.config.headers['Authorization'] = idToken;
    }
    // this.config.headers['Correlation-Object'] = correlationId;
    // this.config.headers['X-Session-Id'] = this.sessionService.getSessionId();
    // this.config.headers['X-Common-Info'] = commonInfo;
    this.config.paramsSerializer = (params) => {
      return this.getQueryStringFormat(params);
    };
  }

  public isDomainStartsWith = (envList: string[]): boolean => {
    for (let idx = 0; idx < envList.length; idx++) {
      if (window.location.host.startsWith(envList[idx])) {
        return true;
      }
    }
    return false;
  };

  /* eslint-disable */

  public async fnRest({ method, url, params, serviceName, config }: BeApiRequest): Promise<any> {
    this.configInit();
    this.config.method = method;
    // this.config.method = this.fnCheckHTTPMethod(method);
    this.config.url = this.fnCheckServiceUrl(url, serviceName ? serviceName : 'etc');
    this.config.params = params?.queryParams ? params?.queryParams : {};
    this.config.data = params?.bodyParams ? params?.bodyParams : {};
    if (config?.timeout) {
      this.config.timeout = config.timeout;
    }

    // if (this.environment === 'local') {
    //   const testSessionInfo = this.sessionService.getLocalSessionInfo();
    //   if (testSessionInfo) {
    //     this.config.headers['X-Session-Info'] = testSessionInfo;
    //   } else {
    //     this.config.headers['X-Session-Info'] = JSON.stringify(this.sessionService.getSessionInfo()).replace(
    //       /[ㄱ-힣]/g,
    //       ''
    //     );
    //   }
    // }

    this.setRouteOnlyForTestEnv(this.config, url, params?.queryParams);

    // 정상 응답일때는 return, error일때는 throw error ???
    try {
      const response: AxiosResponse<any> = await axios.request(this.config);
      if (response && response.data) {
        if (response.data.successOrNot === 'Y') {
          return response.data;
        } else if (response.data.successOrNot === 'N') {
          throw response.data;
        } else {
          const noProperError: Error = {
            successOrNot: 'N',
            statusCode: 'NO.PROPER',
            data: {},
          };
          throw noProperError;
        }
      } else {
        const noResponseError: Error = {
          successOrNot: 'N',
          statusCode: 'NO.RESPONSE',
          data: {},
        };
        throw noResponseError;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (config?.hasOwnProperty('returnValueWhenFail')) throw config.returnValueWhenFail;
      if (error?.response && error?.response.status === Status.RESPONSE_STATUS_401) {
        // this.sessionService.deleteSessionInfo();
        // window.location.assign('/unauthorized');
        return false;
      }

      if (error && error.successOrNot) {
        throw error;
      } else if (error.response && error.response.status === Status.RESPONSE_STATUS_499) {
        const clientCloseRequestError: Error = {
          successOrNot: 'N',
          statusCode: StatusCode.CLIENT_CLOSE_REQUEST,
          data: {},
        };
        throw clientCloseRequestError;
      } else {
        const unknownError: Error = {
          successOrNot: 'N',
          statusCode: 'UNKNOWN.SERVER',
          data: {},
        };
        throw unknownError;
      }
    }
  }

  public setRouteOnlyForTestEnv = (config: AxiosRequestConfig, url: string, params?: object) => {
    // [Test only] BrowserLocalStorage based Route against only local/ft/pr branch
    if (
      (this.environment === 'local' || this.environment === 'dev') &&
      this.isDomainStartsWith(['local', 'pr', 'it'])
    ) {
      const ROUTE_ALL = 'FOR_TEST_ROUTE_ALL_URL';
      const ROUTE_MATCH = 'FOR_TEST_ROUTE_MATCH_URL';
      const SHOW_TOAST_WHEN_ROUTE = 'FOR_TEST_SHOW_TOAST_WHEN_ROUTE';

      // const routeAllDomain = localStorageServiceInstance.getLocalStorageItem(ROUTE_ALL);
      // const routeMatchObject = localStorageServiceInstance.getLocalStorageItem(ROUTE_MATCH);
      // const showToastFlagWhenRoute = localStorageServiceInstance.getLocalStorageItem(SHOW_TOAST_WHEN_ROUTE);
      // if (showToastFlagWhenRoute !== 'Y' && showToastFlagWhenRoute !== 'N') {
      //   localStorageServiceInstance.setLocalStorageItem(SHOW_TOAST_WHEN_ROUTE, 'Y');
      // }

      // const setRouteInfo = (routeDomain: string, url: string) => {
      //   try {
      //     if (showToastFlagWhenRoute === 'Y') showToast('[Only for TEST] Route to : ' + routeDomain);
      //   } catch (error) {}
      //   config.url = routeDomain + url;
      //   config.headers['X-Session-Info'] = JSON.stringify(this.sessionService.getSessionInfo()).replace(/[ㄱ-힣]/g, '');
      // };

      // if (routeAllDomain && routeAllDomain !== 'NONE') {
      //   setRouteInfo(routeAllDomain, url);
      // } else {
      //   localStorageServiceInstance.setLocalStorageItem(ROUTE_ALL, 'NONE');
      // }

      // if (typeof routeMatchObject === 'object' && Object.keys(routeMatchObject).length > 0) {
      //   let urlWithQueryString = url;
      //   if (params) {
      //     if (urlWithQueryString.indexOf('?') < 0) urlWithQueryString += '?';
      //     for (const [key, value] of Object.entries(params)) {
      //       urlWithQueryString += `${key}=${value}&`;
      //     }
      //   }
      //   for (const targetMatchWord in routeMatchObject) {
      //     if (urlWithQueryString.indexOf(targetMatchWord) >= 0) {
      //       setRouteInfo(routeMatchObject[targetMatchWord], url);
      //     }
      //   }
      // } else {
      //   localStorageServiceInstance.setLocalStorageItem(ROUTE_MATCH, {});
      // }
    }
  };

  /* eslint-disable */
  public fnCheckServiceUrl = (url: string, service: string) => {
    let serviceUrl = '';
    if (this.environment === 'local') {
      serviceUrl = this.apiLocation;
      switch (service) {
        case Service.MARKETPLACE:
          serviceUrl += ':' + LocalServicePort.MARKETPLACE + url;
          break;
        default:
          serviceUrl = url;
      }
    } else {
      let prefix = this.protocol;
      switch (service) {
        case Service.MARKETPLACE:
          serviceUrl = prefix + Service.MARKETPLACE + '.' + this.apiLocation + url;
          break;
        default:
          serviceUrl = url;
      }
    }
    return serviceUrl;
  };

  public getQueryStringFormat = (queryParam: any) => {
    const keys = Object.keys(queryParam);
    let queryString = '';
    for (const key of keys) {
      if (
        queryParam[key] !== undefined &&
        queryParam[key] !== null &&
        (!Object.prototype.hasOwnProperty.call(queryParam[key], 'length') || queryParam[key].length > 0)
      ) {
        if (queryString.length > 1) {
          queryString = queryString.concat('&');
        }

        queryString = queryString
          .concat(key.replace('/[]/g', ''))
          .concat('=')
          .concat(encodeURIComponent(queryParam[key]));
      }
    }
    return queryString;
  };
}
