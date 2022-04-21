import { runInAction } from 'mobx';
import { commonCodeServiceInstance } from '../../services/common/CommonCodeService';
import { StatusCode } from '../../services/common/model/Error';
import RootStore from '../Store';
import CommonCodeStore, { CommonCodeModel } from './CommonCodeStore';

const rootStore = new RootStore();
jest.mock('../../services/common/CommonCodeService');
const mockedCommonCodeServiceInstance = commonCodeServiceInstance as jest.Mocked<typeof commonCodeServiceInstance>;

describe('CommonCodeStore', () => {
  it('should be defined', () => {
    expect(CommonCodeStore).toBeDefined();
  });

  it('should be instance of CommonCodeStore', () => {
    expect(new CommonCodeStore(rootStore)).toBeInstanceOf(CommonCodeStore);
  });

  describe('get', () => {
    let commonCodeStore: CommonCodeStore;
    const testCommonCodes = [
      {
        codeId: 'id1',
        codeName: 'name1',
      },
      {
        codeId: 'id2',
        codeName: 'name2',
      },
      {
        codeId: 'id3',
        codeName: 'name3',
      },
    ];

    beforeEach(() => {
      commonCodeStore = new CommonCodeStore(rootStore);
      mockedCommonCodeServiceInstance.getCommonCode.mockClear();
      mockedCommonCodeServiceInstance.getCommonCode.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: testCommonCodes,
      });
    });

    it('should be empty before call get', () => {
      expect(commonCodeStore.codes.size).toEqual(0);
    });

    it('should set commoncode with group code id', async () => {
      const testGroupId = 'test-group-id';
      await commonCodeStore.get(testGroupId);

      expect(commonCodeStore.codes.has(testGroupId)).toBeTruthy();
      expect(commonCodeStore.codes.get(testGroupId)).toEqual(testCommonCodes);
    });

    it('should call once if group code id is same', async () => {
      const testGroupId = 'test-group-id';
      await Promise.all([
        commonCodeStore.get(testGroupId),
        commonCodeStore.get(testGroupId),
        commonCodeStore.get(testGroupId),
      ]);
      expect(mockedCommonCodeServiceInstance.getCommonCode).toBeCalledTimes(1);
    });

    it('should call with each other group code id', async () => {
      const testGroupId = 'test-group-id';
      await Promise.all([
        commonCodeStore.get(testGroupId),
        commonCodeStore.get(testGroupId + '1'),
        commonCodeStore.get(testGroupId + '2'),
      ]);
      expect(mockedCommonCodeServiceInstance.getCommonCode).toBeCalledTimes(3);
    });
  });

  describe('code', () => {
    let commonCodeStore: CommonCodeStore;
    const testCommonCodes = [
      {
        codeId: 'id1',
        codeName: 'name1',
      },
      {
        codeId: 'id2',
        codeName: 'name2',
      },
      {
        codeId: 'id3',
        codeName: 'name3',
      },
    ];

    beforeEach(() => {
      commonCodeStore = new CommonCodeStore(rootStore);
      mockedCommonCodeServiceInstance.getCommonCode.mockClear();
      mockedCommonCodeServiceInstance.getCommonCode.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: testCommonCodes,
      });
    });

    it('should not call if codes have group code id', async () => {
      const testGroupId = 'test-group-id';
      const testCodeId = 'id1';
      const testCodeName = 'name1';

      await commonCodeStore.get(testGroupId);
      mockedCommonCodeServiceInstance.getCommonCode.mockClear();

      const code = commonCodeStore.code(testGroupId, testCodeId);

      expect(code).toEqual(testCodeName);
      expect(mockedCommonCodeServiceInstance.getCommonCode).toBeCalledTimes(0);
    });

    it('should invalid code return code id', async () => {
      const testGroupId = 'test-group-id';
      const testCodeId = 'id4';

      await commonCodeStore.get(testGroupId);
      mockedCommonCodeServiceInstance.getCommonCode.mockClear();

      const code = commonCodeStore.code(testGroupId, testCodeId);

      expect(code).toBeUndefined();
    });

    it('should invalid group code return code id', async () => {
      const testGroupId = 'not-test-group-id';
      const testCodeId = 'id1';

      mockedCommonCodeServiceInstance.getCommonCode.mockClear();
      mockedCommonCodeServiceInstance.getCommonCode.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: [],
      });

      const code = commonCodeStore.code(testGroupId, testCodeId);

      expect(code).toBeUndefined();
    });

    it('should invalid return data return code id', async () => {
      const testGroupId = 'test-group-id';
      const testCodeId = 'id1';
      const wrongReturn = [
        {
          codeId: 'id1',
          codeName: undefined,
        },
      ] as unknown as CommonCodeModel[];

      mockedCommonCodeServiceInstance.getCommonCode.mockClear();
      mockedCommonCodeServiceInstance.getCommonCode.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: wrongReturn,
      });

      const code = commonCodeStore.code(testGroupId, testCodeId);

      expect(code).toBeUndefined();
    });
  });

  describe('retrieveCode', () => {
    let commonCodeStore: CommonCodeStore;

    beforeEach(() => {
      commonCodeStore = new CommonCodeStore(rootStore);
    });

    it('should return default value if apt return empty data', async () => {
      const testGroupId = 'test-group-id';
      const testCodeId = 'id1';

      mockedCommonCodeServiceInstance.getCommonCode.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: undefined,
      });

      await commonCodeStore.retriveCode(testGroupId);

      const code = commonCodeStore.code(testGroupId, testCodeId);
      expect(code).toBeUndefined();
    });

    it('should return default value if api return undefind', async () => {
      const testGroupId = 'test-group-id';
      const testCodeId = 'id1';

      mockedCommonCodeServiceInstance.getCommonCode.mockResolvedValue({
        successOrNot: 'Y',
        statusCode: StatusCode.SUCCESS,
        data: undefined,
      });

      await commonCodeStore.retriveCode(testGroupId);

      const code = commonCodeStore.code(testGroupId, testCodeId);
      expect(code).toBeUndefined();
    });
  });
});
