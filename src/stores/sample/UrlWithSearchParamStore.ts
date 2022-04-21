import { action, makeObservable, observable, computed, runInAction, configure } from 'mobx';
import RootStore from '../Store';
import BaseStore from '../BaseStore';

/* eslint-disable */
class UrlWithSearchParamStore extends BaseStore {
  totalElements: number = 0;
  totalPages: number = 0;
  page: number = 0;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      totalElements: observable,
      totalPages: observable,
      page: observable,
    });
  }

  // with fake call for sample
  async fetchApi(values: any) {
    console.log(' feetch values');
    console.log(values);
    const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay));
    const result = await this.callApiWithState<unknown>(wait, 700);
    runInAction(() => {
      this.totalElements = 250;
      this.totalPages = 25;
      this.page = 1;
    });
  }
}

export default UrlWithSearchParamStore;
