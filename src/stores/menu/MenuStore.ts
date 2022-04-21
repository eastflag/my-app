import { action, makeObservable, observable } from 'mobx';
import BaseStore from '../BaseStore';
import RootStore from '../Store';

export interface Menu {
  label: string;
  url: string;
}

class MenuListStore extends BaseStore {
  menuList: Menu[] = [];

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      menuList: observable,
      init: action,
    });

    this.init();
  }

  init() {
    this.menuList = [
      // TODO: 메뉴 관리가 필요한 스토리에서 추후 개발
      {
        label: 'Launchpad',
        url: '/launchpad',
      },
      {
        label: 'Features',
        url: '/features',
      },
      {
        label: 'Marketplace',
        url: '/marketplace',
      },
      {
        label: 'Stats',
        url: '/stats',
      },
      {
        label: 'Metaverse',
        url: '/metaverse',
      },
      // {
      //   label: 'Go to Sample',
      //   url: '/sample',
      // },
    ];
  }
}

export default MenuListStore;
