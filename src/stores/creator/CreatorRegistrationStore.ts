import { action, makeObservable, observable } from 'mobx';
import { FileObject } from '../../components/common/custom/CustomFileUpload';
import { fileServiceInstance } from '../../services/common/FileService';
import { StatusCode } from '../../services/common/model/Error';
import { BucketType, FileActionType, PresignedUrlFile, UploadInfo } from '../../services/common/model/File';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { creatorRegistrationServiceInstance } from '../../services/creator/CreatorRegistrationService';
import { CreatorRegistrationFileInfo } from '../../services/creator/model/CreatorRegistration';
import BaseStore from '../BaseStore';
import SessionStore from '../common/SessionStore';
import RootStore from '../Store';

export enum CreatorType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
}

export interface ErrorStatus {
  message: string;
  view: boolean;
}

export interface RegisterResult {
  successOrNot: 'Y' | 'N';
  to?: string;
  message?: string;
}

export interface CreatorRegistration {
  creatorType: string;
  creatorName: string;
  introduction: string;
  fileInfo: FileObject[];
  contactEmailAddress: string;
}

export class CreatorRegistraionSignedUrl {
  public static readonly ADDITION_EXPIRE_TIME = 7000;
  public static readonly FILE_NAME_PREFIX = 'creatorregistration';
}

export class CreatorRegistrationStore extends BaseStore {
  creatorType: string = 'INDIVIDUAL';
  creatorName: string = '';
  introduction: string = '';
  fileInfo: FileObject[] = [];
  contactEmailAddress: string = '';
  showDialog: boolean = false;
  fileErrorAlert: ErrorStatus = {
    view: false,
    message: '',
  };
  showLeavePageDialog: boolean = false;
  sessionStore: SessionStore;

  constructor(root: RootStore) {
    super(root);
    this.sessionStore = root.sessionStore;
    makeObservable(this, {
      creatorType: observable,
      creatorName: observable,
      introduction: observable,
      fileInfo: observable,
      contactEmailAddress: observable,
      fileErrorAlert: observable,
      showDialog: observable,
      showLeavePageDialog: observable,
      setCreatorType: action,
      setCreatorName: action,
      setIntroduction: action,
      setFileInfo: action,
      setFileErrorAlert: action,
      setContactEmailAddress: action,
      setShowDialog: action,
      init: action,
      cleanUp: action,
      setShowLeavePageDialog: action,
    });
  }

  init() {
    this.setCreatorType(CreatorType.INDIVIDUAL);
    this.setCreatorName('');
    this.setIntroduction('');
    this.setFileInfo([]);
    this.setContactEmailAddress(this.sessionStore.memberEmailAddress);
    this.setShowDialog(false);
    this.setFileErrorAlert({
      view: false,
      message: '',
    });
    this.setShowLeavePageDialog(false);
  }

  cleanUp() {
    this.setCreatorType('');
    this.setCreatorName('');
    this.setIntroduction('');
    this.setFileInfo([]);
    this.setContactEmailAddress('');
    this.setShowDialog(false);
    this.setFileErrorAlert({
      view: false,
      message: '',
    });
    this.setShowLeavePageDialog(false);
  }

  setCreatorType(creatorType: string) {
    this.creatorType = creatorType;
  }

  setCreatorName(creatorName: string) {
    this.creatorName = creatorName;
  }

  setIntroduction(introduction: string) {
    this.introduction = introduction;
  }

  setFileInfo(fileInfo: FileObject[]) {
    this.fileInfo = fileInfo;
  }

  setFileErrorAlert(fileErrorAlert: ErrorStatus) {
    this.fileErrorAlert = fileErrorAlert;
  }

  setContactEmailAddress(contactEmailAddress: string) {
    this.contactEmailAddress = contactEmailAddress;
  }

  setShowDialog(showDialog: boolean) {
    this.showDialog = showDialog;
  }

  setShowLeavePageDialog(show: boolean) {
    this.showLeavePageDialog = show;
  }

  async registerCreator() {
    const registerResult: RegisterResult = { successOrNot: 'N' };
    this.setFileErrorAlert({ message: '', view: false });

    try {
      const requestFileInfo: CreatorRegistrationFileInfo[] = [];

      if (this.fileInfo && this.fileInfo.length > 0) {
        const fileList: File[] = this.fileInfo.map((file) => file.object);
        const uploadInfo: UploadInfo = {
          additionExpireTime: CreatorRegistraionSignedUrl.ADDITION_EXPIRE_TIME,
          bucketType: BucketType.PUBLIC,
          fileActionType: FileActionType.UPLOAD,
          files: fileList,
          fileDirectory: CreatorRegistraionSignedUrl.FILE_NAME_PREFIX,
        };
        const resultFileUpload = await this.callApiWithConfig<PresignedUrlFile[] | string>(
          fileServiceInstance.fileUpload.bind(fileServiceInstance),
          uploadInfo,
          {
            withDimmed: true,
          }
        );
        if (typeof resultFileUpload === 'string') {
          throw { successOrNot: 'N', statusCode: StatusCode.FAIL, message: 'file upload fail.' } as BeApiResponse<
            string | null
          >;
        } else {
          const urlInfo = resultFileUpload as unknown as PresignedUrlFile[];
          urlInfo.forEach((url, i) => {
            requestFileInfo.push({
              fileSize: this.fileInfo[i].object.size,
              fileUrl: url.fileName,
            });
          });
        }
      }

      const result = await this.callApiWithConfig<BeApiResponse<string | object>>(
        creatorRegistrationServiceInstance.registerCreator,
        {
          creatorType: this.creatorType,
          creatorName: this.creatorName,
          introduction: this.introduction,
          contactEmailAddress: this.contactEmailAddress,
          fileInfo: requestFileInfo,
        },
        { withDimmed: true }
      );

      if (result?.successOrNot === 'Y' && result?.statusCode === StatusCode.SUCCESS) {
        registerResult.successOrNot = 'Y';
        registerResult.to = '/main';
        return registerResult;
      }
    } catch (error: unknown) {
      const errorInfo: BeApiResponse<string | null> = error as BeApiResponse<string | null>;
      registerResult.successOrNot = 'N';
      if (errorInfo.data) registerResult.message = errorInfo.data;
    }

    return registerResult;
  }
}

export default CreatorRegistrationStore;
