import { commonCodeServiceInstance } from '../../services/common/CommonCodeService';
import { StatusCode } from '../../services/common/model/Error';
import RootStore from '../Store';
import CommonCodesStore, { CommonCode, CommonCodeDataModel } from './CommonCodesStore';

const rootStore = new RootStore();
jest.mock('../../services/common/CommonCodeService');
const mockedCommonCodeServiceInstance = commonCodeServiceInstance as jest.Mocked<typeof commonCodeServiceInstance>;

const commonCodesStore = new CommonCodesStore(rootStore);
const testMockCodeData: CommonCode = {
  MISSION_PRIVATE: {
    codeName: 'Mission/Private',
    parentCodeId: 'ROOT',
    sortOrder: 1,
    level: 1,
    additionalInfo: '123',
    data: {
      SERVICE_ACTION_NAEMOWORLD_PRIVATE: {
        parentCodeId: 'MISSION_PRIVATE',
        sortOrder: 3,
        level: 2,
        data: {},
        codeName: '서비스 액션(naemo world)',
      },
    } as unknown as CommonCodeDataModel,
  } as unknown as CommonCodeDataModel,
  MISSION_WHITELIST: {
    codeName: 'Mission/Whitelist',
    parentCodeId: 'ROOT',
    sortOrder: 1,
    level: 1,
    data: {
      QNA_WHITELIST: {
        codeName: '질의응답',
        parentCodeId: 'MISSION_WHITELIST',
        sortOrder: 1,
        level: 2,
        data: {
          SHORT_ANSWER_WHITELIST: {
            parentCodeId: 'QNA_WHITELIST',
            sortOrder: 1,
            level: 3,
            data: {},
            codeName: '주관식',
          },
          MULTIPLE_CHOICE_WHITELIST: {
            parentCodeId: 'QNA_WHITELIST',
            sortOrder: 2,
            level: 3,
            data: {},
            codeName: '객관식',
          },
        } as unknown as CommonCodeDataModel,
      } as unknown as CommonCodeDataModel,
    } as unknown as CommonCodeDataModel,
  } as unknown as CommonCodeDataModel,
};

describe('CommonCodesStore', () => {
  it('should be defined', () => {
    expect(CommonCodesStore).toBeDefined();
  });

  it('should be instance of CommonCodesStore', () => {
    expect(new CommonCodesStore(rootStore)).toBeInstanceOf(CommonCodesStore);
  });

  describe('init', () => {
    beforeEach(() => {
      mockedCommonCodeServiceInstance.getCommonCode.mockClear();
      mockedCommonCodeServiceInstance.getCommonCodes.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: testMockCodeData,
      });
    });

    it('should set isLoadded(true) and codes data', async () => {
      await commonCodesStore.init();
      expect(commonCodesStore.isLoadded).toEqual(true);
      expect(commonCodesStore.codes).toEqual(testMockCodeData);
    });
  });

  describe('getSortedCodeList', () => {
    beforeEach(() => {
      commonCodesStore.codes = testMockCodeData;
    });

    it('should set commoncode with group code id', async () => {
      const missionPrivateFirst = commonCodesStore.getSortedCodeList('MISSION_PRIVATE');
      const missionPrivateSecond = commonCodesStore.getSortedCodeList('MISSION_PRIVATE');
      const socilaActionWhitelist = commonCodesStore.getSortedCodeList(
        'QNA_WHITELIST',
        commonCodesStore.codes.MISSION_WHITELIST
      );
      expect(missionPrivateFirst).toEqual(missionPrivateSecond);
      let codeName;
      let codeId;
      if (socilaActionWhitelist) {
        codeName = socilaActionWhitelist[0][1].codeName;
        codeId = socilaActionWhitelist[1][0];
      }
      expect(codeName).toEqual('주관식');
      expect(codeId).toEqual('MULTIPLE_CHOICE_WHITELIST');
    });
  });
});
