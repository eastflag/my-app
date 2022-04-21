import RootStore from '../Store';

const rootStore = new RootStore();

describe('AppBarStore 테스트', () => {
  const { appBarStore } = rootStore;

  it('turnOnTransparency() is called.', () => {
    appBarStore.turnOnTransparency();

    expect(appBarStore.isTransparent).toEqual(true);
  });

  it('turnOffTransparency() is called.', () => {
    appBarStore.turnOffTransparency();

    expect(appBarStore.isTransparent).toEqual(false);
  });
});
