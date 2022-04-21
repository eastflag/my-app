import RootStore from '../Store';
import DimStore from './DimStore';

const rootStore = new RootStore();

describe('DimStore 테스트', () => {
  const { dimStore } = rootStore;

  beforeEach(() => {
    dimStore.activateRequestCount = 0;
  });

  it('activate() is called once.', () => {
    dimStore.activate();

    expect(dimStore.activateRequestCount).toEqual(1);
    expect(dimStore.isActive).toEqual(true);
  });

  it('Several times, activate() is called.', () => {
    dimStore.activate();
    dimStore.activate();

    expect(dimStore.activateRequestCount).toEqual(2);
    expect(dimStore.isActive).toEqual(true);
  });

  it('deactivate() is called once.', () => {
    dimStore.deactivate();

    expect(dimStore.activateRequestCount).toEqual(0);
    expect(dimStore.isActive).toEqual(false);
  });

  it('After multiple calls to activate(), deactivate() is called several times.', () => {
    dimStore.activate();
    dimStore.activate();
    dimStore.activate();
    dimStore.deactivate();
    dimStore.deactivate();

    expect(dimStore.activateRequestCount).toEqual(1);
    expect(dimStore.isActive).toEqual(true);
  });
});
