import { makeObservable, observable, runInAction } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { CommonCodeRequest } from '../../services/common/model/CommonCode';
import { commonCodeServiceInstance } from '../../services/common/CommonCodeService';

export interface CommonCodeModel {
  codeId: string;
  codeName: string;
}
class CommonCodeStore extends BaseStore {
  codes: Map<string, CommonCodeModel[]> = new Map();
  code: (groupCodeId: string, codeId: string) => string | undefined;
  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      codes: observable.deep,
    });
    this.code = this._code.bind(this);
  }

  private _code(groupCodeId: string, codeId: string) {
    const codes = this.codes.get(groupCodeId);
    if (codes) {
      const code = codes.find((c) => c.codeId === codeId);
      if (code) {
        return code.codeName;
      }
    } else {
      this.get(groupCodeId);
    }
  }

  async get(groupCodeId: string) {
    if (!this.codes.has(groupCodeId)) {
      runInAction(() => {
        this.codes.set(groupCodeId, []);
      });
      const code = await this.retriveCode(groupCodeId);
      if (code) {
        runInAction(() => {
          this.codes.set(groupCodeId, code);
        });
      }
    }
    return this.codes.get(groupCodeId);
  }

  async retriveCode(groupCodeId: string) {
    const commonCodeRequest: CommonCodeRequest = {
      groupCodeId,
    };
    const codeResult = await this.callApiWithStateEvenLoading<BeApiResponse<CommonCodeModel[]>>(
      commonCodeServiceInstance.getCommonCode,
      commonCodeRequest
    );

    if (codeResult?.successOrNot === 'Y') {
      return codeResult.data;
    }
  }
}
export default CommonCodeStore;
