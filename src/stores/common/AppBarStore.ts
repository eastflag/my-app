import { action, makeObservable, observable } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';

class AppBarStore extends BaseStore {
  isTransparent: boolean = false;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      isTransparent: observable,
      turnOnTransparency: action,
      turnOffTransparency: action,
    });
  }

  turnOnTransparency() {
    this.isTransparent = true;
  }

  turnOffTransparency() {
    this.isTransparent = false;
  }
}

export default AppBarStore;
