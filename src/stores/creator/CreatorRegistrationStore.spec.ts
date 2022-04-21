import { fileServiceInstance } from '../../services/common/FileService';
import { StatusCode } from '../../services/common/model/Error';
import { BucketType, FileActionType, PresignedUrlFile } from '../../services/common/model/File';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { creatorRegistrationServiceInstance } from '../../services/creator/CreatorRegistrationService';
import { FileType } from '../../utils/FileUtils';
import RootStore from '../Store';
import { CreatorType } from './CreatorRegistrationStore';

const rootStore = new RootStore();

jest.mock('../../services/creator/CreatorRegistrationService.ts');
jest.mock('../../services/common/FileService.ts');
const mockedRegisterApi = creatorRegistrationServiceInstance as jest.Mocked<typeof creatorRegistrationServiceInstance>;
const mockedFileApi = fileServiceInstance as jest.Mocked<typeof fileServiceInstance>;

describe('CreatorRegistrationStore 테스트', () => {
  const { creatorRegistrationStore } = rootStore;

  describe('registerCreator() call 테스트', () => {
    let mockApiResponse: BeApiResponse<string | object> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
      data: {},
    };

    let mockFileApiResponse: PresignedUrlFile[] | '' = [
      {
        additionExpireTime: 90000,
        bucketType: BucketType.PUBLIC,
        fileActionType: FileActionType.UPLOAD,
        fileName: 'creatorregistration/스크린샷 2022-03-11 오전 11.26.37.png',
        preSignedUrl:
          'https://s3-an2-dev-naemo-public.s3.ap-northeast-2.amazonaws.com/creatorRegistration/%E1%84%89%E1%85%B3%E1%84%8F%E1%85',
      },
    ];

    beforeEach(() => {
      creatorRegistrationStore.setContactEmailAddress('yooncheol14@lgcns.com');
      creatorRegistrationStore.setCreatorName('charles');
      creatorRegistrationStore.setCreatorType('INDiVIDUAL');
      creatorRegistrationStore.setIntroduction('intro입니다.');
    });
    it('입점신청 성공 - 파일 없고, 입점 신청 성공 리턴, navigationInfo.to  = /main', async () => {
      mockedRegisterApi.registerCreator.mockResolvedValue(mockApiResponse);
      const result = await creatorRegistrationStore.registerCreator();
      expect(result.to).toEqual('/main');
    });

    it('입점신청 성공 - 파일 있고, 입점 신청 성공 리턴, navigationInfo.to = /main', async () => {
      creatorRegistrationStore.setFileInfo([
        {
          id: 123,
          object: new File([''], 'filename', { type: 'text/html' }),
          fileType: FileType.IMAGE,
        },
      ]);

      mockedRegisterApi.registerCreator.mockResolvedValue(mockApiResponse);
      mockedFileApi.fileUpload.mockResolvedValue(mockFileApiResponse);

      const result = await creatorRegistrationStore.registerCreator();
      expect(result.to).toEqual('/main');
    });

    it('입점신청 실패 - 파일이 있고, 파일 업로드 실패', async () => {
      mockFileApiResponse = '';
      mockedFileApi.fileUpload.mockResolvedValue(mockFileApiResponse);

      const result = await creatorRegistrationStore.registerCreator();
      expect(result.to).toBeUndefined();
      expect(result.successOrNot).toEqual('N');
    });

    it('입점신청 실패 - 파일이 없고, 입점 신청 실패 리턴, navigationInfo.to id undefined', async () => {
      mockApiResponse = {
        successOrNot: 'N',
        statusCode: StatusCode.INVALID_PARAMETER,
        data: 'check email format.',
      };
      creatorRegistrationStore.setFileInfo([]);
      mockedRegisterApi.registerCreator.mockRejectedValue(mockApiResponse);
      const result = await creatorRegistrationStore.registerCreator();
      expect(result.to).toBeUndefined();
      expect(result.successOrNot).toEqual('N');
    });
  });

  describe('action 테스트', () => {
    it('cleanUp() called', () => {
      creatorRegistrationStore.cleanUp();
      expect(creatorRegistrationStore.creatorType).toBe('');
      expect(creatorRegistrationStore.contactEmailAddress).toBe('');
      expect(creatorRegistrationStore.fileInfo).toEqual([]);
      expect(creatorRegistrationStore.showDialog).toBe(false);
    });

    it('init() called', () => {
      creatorRegistrationStore.init();
      expect(creatorRegistrationStore.creatorType).toBe(CreatorType.INDIVIDUAL);
      expect(creatorRegistrationStore.introduction).toBe('');
    });

    it('setShowDialog() called', () => {
      creatorRegistrationStore.setShowDialog(true);
      expect(creatorRegistrationStore.showDialog).toBe(true);
    });
  });
});
