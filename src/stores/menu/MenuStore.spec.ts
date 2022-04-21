import RootStore from '../Store';
import MenuListStore from './MenuStore';

const rootStore = new RootStore();
const menuListStore = new MenuListStore(rootStore);

describe('MenuListStore 테스트', () => {
  it('init()', () => {
    menuListStore.init();

    expect(menuListStore.menuList).not.toBeNull();
  });
});
