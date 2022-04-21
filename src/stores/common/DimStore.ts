import { action, computed, makeObservable, observable } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';

class DimStore extends BaseStore {
  activateRequestCount = 0;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      activateRequestCount: observable,
      isActive: computed,
      activate: action,
      deactivate: action,
    });
  }

  get isActive() {
    return this.activateRequestCount > 0;
  }

  activate() {
    this.activateRequestCount += 1;
  }

  deactivate() {
    if (this.isActive) {
      this.activateRequestCount -= 1;
    }
  }
}

export default DimStore;
