import { createContext, ReactNode, useContext } from 'react';
import RootStore from '../stores/Store';

// https://github.com/ivandotv/react-hooks-mobx-root-store/tree/master/src ???

let store: RootStore;

export const StoreContext = createContext({} as RootStore);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  store = store ?? new RootStore();

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
};
