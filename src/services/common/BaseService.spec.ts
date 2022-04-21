import { cleanup } from '@testing-library/react';
import axios, { AxiosRequestConfig } from 'axios';
import BaseService from './BaseService';
import { Service, LocalServicePort } from './model/Service';
import { Status } from './model/Status.enum';
import { BeApiRequest } from './model/RestApi';
import { Error } from './model/Error';
import { Method } from './model/Method';
// import { localStorageServiceInstance } from './LocalStorageService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const baseServiceMock = new BaseService();

afterEach(cleanup);

describe('BaseService 호출', () => {
  describe('fnRest()', () => {
    it('응답(response)이 성공인 경우 해당 데이터 리턴 한다.', async () => {
      const responseMock = {
        data: {
          successOrNot: 'Y',
          statusCode: 'SUCCESS',
          data: {
            sessionId: 'test-session-id',
            member: {
              memberId: 1,
              memberName: '홍길동',
              memberAuthType: 'PP_TEAM',
              memberTypeCode: 'MEM',
              companyCode: 'T00001',
              departmentName: '부서명',
            },
          },
        },
      };
      const beApiRequest: BeApiRequest = {
        method: Method.POST,
        url: '/v1/account/session',
        serviceName: Service.MARKETPLACE,
      };
      mockedAxios.request.mockReturnValue(Promise.resolve(responseMock));
      const response = await baseServiceMock.fnRest(beApiRequest);
      expect(response).toEqual(responseMock.data);
    });

    it('응답(response)이 실패, 비즈니스 Error인 경우 해당 데이터 리턴 한다.', async () => {
      const expectedCode = 'BIZ.ERROR';
      const responseMock = {
        data: {
          successOrNot: 'N',
          statusCode: 'BIZ.ERROR',
          data: {},
        },
      };
      mockedAxios.request.mockReturnValue(Promise.resolve(responseMock));

      const beApiRequest: BeApiRequest = {
        method: Method.GET,
        url: '/v1/reservation',
        serviceName: Service.MARKETPLACE,
      };

      try {
        await baseServiceMock.fnRest(beApiRequest);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line
        expect(error.statusCode).toEqual(expectedCode);
      }
    });

    it('응답(response)이 실패, 응답형식이 스펙에 맞지 않는 Error인 경우 Error 타입 리턴 한다.', async () => {
      const expectedCode = 'NO.PROPER';
      const responseMock = {
        data: {
          successOrNot: '',
          statusCode: 'NO.PROPER',
          data: {},
        },
      };
      mockedAxios.request.mockReturnValue(Promise.resolve(responseMock));
      const beApiRequest: BeApiRequest = {
        method: Method.GET,
        url: '/v1/reservation',
        serviceName: Service.MARKETPLACE,
      };

      try {
        await baseServiceMock.fnRest(beApiRequest);
      } catch (error) {
        // eslint-disable-next-line
        expect((error as Error).statusCode).toEqual(expectedCode);
      }
    });

    it('응답(response)이 실패, 서버 Error인 경우 Error 타입 리턴 한다.', async () => {
      const expectedCode = 'UNKNOWN.SERVER';
      const responseMock = {};
      mockedAxios.request.mockReturnValue(Promise.reject(responseMock));
      const beApiRequest: BeApiRequest = {
        method: Method.GET,
        url: '/v1/reservation',
        serviceName: Service.MARKETPLACE,
      };

      try {
        await baseServiceMock.fnRest(beApiRequest);
      } catch (error) {
        // eslint-disable-next-line
        expect((error as Error).statusCode).toEqual(expectedCode);
      }
    });
    it('처리 중 unauthorized Error가 발생하는 경우 unauthorized 페이지로 이동한다.', async () => {
      const mockedError = {
        response: {
          status: Status.RESPONSE_STATUS_401,
        },
      };

      mockedAxios.request.mockImplementation(() => {
        throw mockedError;
      });
      // const windowSpy = jest.spyOn(window.location, 'assign').mockReturnValue();
      const beApiRequest: BeApiRequest = {
        method: Method.GET,
        url: '/v1/reservation',
        serviceName: Service.MARKETPLACE,
      };

      const result = await baseServiceMock.fnRest(beApiRequest);

      expect(result).toEqual(false);
      // windowSpy.mockRestore();
    });

    it('응답(response)이 실패, 응답이 null인 경우 Error 타입 리턴 한다.', async () => {
      const expectedCode = 'NO.RESPONSE';
      mockedAxios.request.mockReturnValue(Promise.resolve(null));
      const beApiRequest: BeApiRequest = {
        method: Method.GET,
        url: '/v1/reservation',
        serviceName: Service.MARKETPLACE,
      };

      try {
        await baseServiceMock.fnRest(beApiRequest);
      } catch (error) {
        // eslint-disable-next-line
        expect((error as Error).statusCode).toEqual(expectedCode);
      }
    });
  });

  xdescribe('fnRest(), route동작 확인', () => {
    it('dev 환경에서는 route 동작하지 않는다', () => {
      baseServiceMock.setEnvironment('dev');
      baseServiceMock.isDomainStartsWith = jest.fn().mockReturnValue(false); // eslint-disable-line
      // localStorageServiceInstance.setLocalStorageItem('FOR_TEST_ROUTE_ALL_URL', 'https://new.domain.com');
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://cpp-ui.painpoint-dev.lgstation.com/v1/account/session',
        headers: {},
      };
      const url = '/v1/account/session';

      baseServiceMock.setRouteOnlyForTestEnv(config, url, {});
      expect(config.url).toEqual('https://cpp-ui.painpoint-dev.lgstation.com/v1/account/session');
    });
    it('pr/ft/local 환경에서는 route(ALL_URL) 설정에 따라 BE domain route 동작한다', () => {
      baseServiceMock.setEnvironment('dev');
      baseServiceMock.isDomainStartsWith = jest.fn().mockReturnValue(true); // eslint-disable-line
      // localStorageServiceInstance.setLocalStorageItem('FOR_TEST_ROUTE_ALL_URL', 'https://new.domain.com');

      const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://cpp-ui.painpoint-dev.lgstation.com/v1/account/session',
        headers: {},
      };
      const url = '/v1/account/session';

      baseServiceMock.setRouteOnlyForTestEnv(config, url, {});
      expect(config.url).toEqual('https://new.domain.com' + url);
    });
    it('pr/ft/local 환경에서는 route(MATCH_URL) 설정에 따라 url match되면 BE domain route 동작한다', () => {
      baseServiceMock.setEnvironment('dev');
      baseServiceMock.isDomainStartsWith = jest.fn().mockReturnValue(true); // eslint-disable-line
      // localStorageServiceInstance.setLocalStorageItem('FOR_TEST_ROUTE_ALL_URL', 'NONE');
      // localStorageServiceInstance.setLocalStorageItem('FOR_TEST_ROUTE_MATCH_URL', {
      //   'v1/account/session': 'https://new.domain.com',
      // });

      const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://cpp-ui.painpoint-dev.lgstation.com/v1/account/session',
        headers: {},
      };
      const url = '/v1/account/session';

      baseServiceMock.setRouteOnlyForTestEnv(config, url, {});
      expect(config.url).toEqual('https://new.domain.com' + url);
    });
    it('pr/ft/local 환경에서는 route(MATCH_URL) 설정에 따라 url match되지 않으면 BE domain route 동작 하지않는다', () => {
      baseServiceMock.setEnvironment('dev');
      baseServiceMock.isDomainStartsWith = jest.fn().mockReturnValue(true); // eslint-disable-line
      // localStorageServiceInstance.setLocalStorageItem('FOR_TEST_ROUTE_MATCH_URL', {
      //   'v1/matchUrl': 'https://new.domain.com',
      // });

      const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://cpp-ui.painpoint-dev.lgstation.com/v1/account/session',
        headers: {},
      };
      const url = '/v1/account/session';

      baseServiceMock.setRouteOnlyForTestEnv(config, url, {});
      expect(config.url).toEqual('https://cpp-ui.painpoint-dev.lgstation.com/v1/account/session');
    });
    it('pr/ft/local 환경에서는 route(MATCH_URL) 설정에 따라 url(queryString) match되면 BE domain route 동작한다', () => {
      baseServiceMock.setEnvironment('dev');
      baseServiceMock.isDomainStartsWith = jest.fn().mockReturnValue(true); // eslint-disable-line
      // localStorageServiceInstance.setLocalStorageItem('FOR_TEST_ROUTE_MATCH_URL', {
      //   'queryString1=testValue': 'https://new.domain.com',
      // });

      const config: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://cpp-ui.painpoint-dev.lgstation.com/v1/account/session',
        headers: {},
      };
      const queryParams = {
        queryString1: 'testValue',
      };
      const url = '/v1/account/session';

      baseServiceMock.setRouteOnlyForTestEnv(config, url, queryParams);
      expect(config.url).toEqual('https://new.domain.com/v1/account/session');
    });
  });

  describe('fnCheckServiceUrl()', () => {
    it('local 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
      const mockUrl = '/v1/session';
      const mockService = Service.MARKETPLACE;
      baseServiceMock.setEnvironment('local');
      const expectedUrl = baseServiceMock.getAPILocation() + ':' + LocalServicePort.MARKETPLACE + mockUrl;
      const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
      expect(response).toEqual(expectedUrl);
    });
    // it('local 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/dashboard';
    //   const mockService = Service.CPP_VI;
    //   baseServiceMock.setEnvironment('local');
    //   const expectedUrl = baseServiceMock.getAPILocation() + ':' + ServicePort.CPP_VI + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('local 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/b2b/test';
    //   const mockService = Service.CPP_BE_B2B;
    //   baseServiceMock.setEnvironment('local');
    //   const expectedUrl = baseServiceMock.getAPILocation() + ':' + ServicePort.CPP_BE_B2B + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('local 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/c-b-p/test';
    //   const mockService = Service.CPP_BE_PUBLIC;
    //   baseServiceMock.setEnvironment('local');
    //   const expectedUrl = baseServiceMock.getAPILocation() + ':' + ServicePort.CPP_BE_PUBLIC + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });

    it('local 환경, 서비스에 맞는 url을 리턴 한다.(etc)', () => {
      const mockUrl = '/v1/';
      const mockService = 'etc';
      baseServiceMock.setEnvironment('local');
      const expectedUrl = mockUrl;
      const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
      expect(response).toEqual(expectedUrl);
    });
    it('dev 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
      const mockUrl = '/v1/session';
      const mockService = Service.MARKETPLACE;

      baseServiceMock.setEnvironment('dev');

      const expectedUrl = 'https://' + Service.MARKETPLACE + '.' + baseServiceMock.getAPILocation() + mockUrl;
      const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
      expect(response).toEqual(expectedUrl);
    });
    // it('dev 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/dashboard';
    //   const mockService = Service.CPP_VI;

    //   baseServiceMock.setEnvironment('dev');

    //   const expectedUrl = 'https://' + Service.CPP_VI + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('dev 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/b2b/test';
    //   const mockService = Service.CPP_BE_B2B;

    //   baseServiceMock.setEnvironment('dev');

    //   const expectedUrl = 'https://' + Service.CPP_BE_B2B + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('dev 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/c-b-p/test';
    //   const mockService = Service.CPP_BE_PUBLIC;

    //   baseServiceMock.setEnvironment('dev');

    //   const expectedUrl = 'https://' + Service.CPP_BE_PUBLIC + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    it('dev 환경, 서비스에 맞는 url을 리턴 한다.(etc)', () => {
      const mockUrl = '/v1/';
      const mockService = 'etc';
      baseServiceMock.setEnvironment('dev');
      const expectedUrl = mockUrl;
      const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
      expect(response).toEqual(expectedUrl);
    });
    it('release 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
      const mockUrl = '/v1/session';
      const mockService = Service.MARKETPLACE;

      baseServiceMock.setEnvironment('release');

      const expectedUrl = 'https://' + Service.MARKETPLACE + '.' + baseServiceMock.getAPILocation() + mockUrl;
      const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
      expect(response).toEqual(expectedUrl);
    });
    // it('release 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/dashboard';
    //   const mockService = Service.CPP_VI;

    //   baseServiceMock.setEnvironment('release');

    //   const expectedUrl = 'https://release-' + Service.CPP_VI + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('release 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/c-b-p/test';
    //   const mockService = Service.CPP_BE_PUBLIC;

    //   baseServiceMock.setEnvironment('release');

    //   const expectedUrl = 'https://release-' + Service.CPP_BE_PUBLIC + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('release 환경, 서비스에 맞는 url을 리턴 한다.(etc)', () => {
    //   const mockUrl = '/v1/';
    //   const mockService = 'etc';
    //   baseServiceMock.setEnvironment('release');
    //   const expectedUrl = mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('develop2 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/session';
    //   const mockService = Service.MARKETPLACE;

    //   baseServiceMock.setEnvironment('develop2');

    //   const expectedUrl = 'https://develop2-' + Service.MARKETPLACE + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('develop2 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/dashboard';
    //   const mockService = Service.CPP_VI;

    //   baseServiceMock.setEnvironment('develop2');

    //   const expectedUrl = 'https://develop2-' + Service.CPP_VI + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    // it('develop2 환경, 서비스에 맞는 url을 리턴 한다.(backend)', () => {
    //   const mockUrl = '/v1/b2b/test';
    //   const mockService = Service.CPP_BE_B2B;

    //   baseServiceMock.setEnvironment('develop2');

    //   const expectedUrl = 'https://develop2-' + Service.CPP_BE_B2B + '.' + baseServiceMock.getAPILocation() + mockUrl;
    //   const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
    //   expect(response).toEqual(expectedUrl);
    // });
    it('develop2 환경, 서비스에 맞는 url을 리턴 한다.(etc)', () => {
      const mockUrl = '/v1/';
      const mockService = 'etc';
      baseServiceMock.setEnvironment('develop2');
      const expectedUrl = mockUrl;
      const response = baseServiceMock.fnCheckServiceUrl(mockUrl, mockService);
      expect(response).toEqual(expectedUrl);
    });
  });

  describe('getQueryStringFormat()', () => {
    it('object를 queryString format의 문자열로 변환해준다.', () => {
      const mockObject = { paramA: 'hello', paramB: 'world' };
      const expectedQueryString = 'paramA=hello&paramB=world';
      const response = baseServiceMock.getQueryStringFormat(mockObject);
      expect(response).toEqual(expectedQueryString);
    });
  });
});
