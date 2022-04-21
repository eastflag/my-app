import { StatusCode } from '../../services/common/model/Error';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { sessionStorageServiceInstance } from '../../services/common/SessionStorageService';
import { logoutServiceInstance } from '../../services/member/LogoutService';
import RootStore from '../Store';

const rootStore = new RootStore();

jest.mock('../../services/member/LogoutService.ts');
const mockedApi = logoutServiceInstance as jest.Mocked<typeof logoutServiceInstance>;

describe('LogoutStore 테스트', () => {
  const { logoutStore } = rootStore;

  describe('requestLogout() 테스트 - ID Token 값으로 로그아웃', () => {
    let mockIdToken = '987987123';

    let mockApiResponse: BeApiResponse<void> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
    };

    it('idToken 없을 시, false값 리턴', async () => {
      sessionStorageServiceInstance.setIdToken('');
      const result = await logoutStore.requestLogout();
      expect(result).toEqual(false);
    });

    it('로그아웃 성공 시, true 값 리턴', async () => {
      sessionStorageServiceInstance.setIdToken(mockIdToken);
      mockedApi.requestLogout.mockResolvedValue(mockApiResponse);
      const result = await logoutStore.requestLogout();

      expect(result).toEqual(true);
    });

    it('ID Token 값 없을 시, 로그아웃 false 값 리턴', async () => {
      mockIdToken = '';

      sessionStorageServiceInstance.setIdToken(mockIdToken);
      mockedApi.requestLogout.mockResolvedValue(mockApiResponse);
      const result = await logoutStore.requestLogout();

      expect(result).toEqual(false);
    });

    it('에러 발생 시, 로그아웃 false 값 리턴', async () => {
      mockIdToken = '987987123';

      mockApiResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.FAIL,
      };

      sessionStorageServiceInstance.setIdToken(mockIdToken);
      mockedApi.requestLogout.mockRejectedValue(mockApiResponse);
      const result = await logoutStore.requestLogout();

      expect(result).toEqual(false);
    });
  });
});
