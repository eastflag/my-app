import { action, makeObservable, observable, toJS } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { commonCodeServiceInstance } from '../../services/common/CommonCodeService';

enum LevelOneCommonCodeId {
  BLOCKCHAIN_TYPE = 'BLOCKCHAIN_TYPE',
  CREATOR_TYPE = 'CREATOR_TYPE',
  LAUNCHPAD_PLAN_STATUS = 'LAUNCHPAD_PLAN_STATUS',
  LAUNCHPAD_REGISTER_PROCESS_STATUS = 'LAUNCHPAD_REGISTER_PROCESS_STATUS',
  MISSION_PRIVATE = 'MISSION_PRIVATE',
  MISSION_WHITELIST = 'MISSION_WHITELIST',
  NFT_TYPE = 'NFT_TYPE',
  SALE_TYPE = 'SALE_TYPE',
}

export interface CommonCodeDataModel {
  codeName: string;
  parentCodeId: string;
  sortOrder: number;
  additionalInfo: string;
  level: number;
  data: {
    [key: string]: CommonCodeDataModel;
  };
}

export type CommonCode = {
  [key in keyof typeof LevelOneCommonCodeId]?: CommonCodeDataModel;
};

class CommonCodeStore extends BaseStore {
  isLoadded: boolean = false;
  codes: CommonCode = {};
  private sortedCodes: { [key: string]: [string, CommonCodeDataModel][] } = {};
  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      isLoadded: observable,
      codes: observable,
      init: action,
    });
  }

  async init() {
    const codeIds: string[] = [];
    Object.keys(LevelOneCommonCodeId).forEach((item) => codeIds.push(item));
    this.codes = (await this.retrieveCodes(codeIds)) as CommonCode;
    this.isLoadded = true;
  }

  async retrieveCodes(codeIds: string[]) {
    const codeResult = await this.callApiWithConfig<BeApiResponse<CommonCode>>(
      commonCodeServiceInstance.getCommonCodes,
      {
        codeIdList: codeIds,
      }
    );

    if (codeResult?.successOrNot === 'Y' && codeResult.data) {
      return codeResult.data;
    }
  }

  getSortedCodeList(parentCodeId: string, grandParentCodeObject?: CommonCodeDataModel) {
    try {
      const sortedCode = this.sortedCodes.parentCodeId;
      if (sortedCode) {
        return toJS(sortedCode);
      } else {
        if (grandParentCodeObject) {
          const sortedCodeList = toJS(
            Object.entries(grandParentCodeObject.data[parentCodeId].data).sort(
              (childA, childB) => childA[1].sortOrder - childB[1].sortOrder
            )
          );
          this.sortedCodes[parentCodeId] = sortedCodeList;
          return sortedCodeList;
        } else {
          const codeListFromRoot = this.getCodeList(parentCodeId);
          if (codeListFromRoot) {
            this.sortedCodes[parentCodeId] = codeListFromRoot;
            return codeListFromRoot;
          }
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private getCodeList(parentCodeId: string) {
    const parentCode = this.getParentCode(parentCodeId);
    if (parentCode) {
      return Object.entries(parentCode[1].data);
    }
  }

  private getParentCode(parentCodeId: string) {
    if (this.codes) {
      return Object.entries(this.codes).find(([key]) => key == parentCodeId);
    }
  }
}

export default CommonCodeStore;
