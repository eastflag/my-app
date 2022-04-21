import { action, makeObservable, observable } from 'mobx';
import RootStore from './Store';

interface CallApiConfig {
  evenLoading?: boolean;
  withDimmed?: boolean;
}

class BaseStore {
  root: RootStore | null = null;

  loading: boolean = false;
  error: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  callApiWithState = async <T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackFn: (...args: any[]) => Promise<T>,
    params?: number | string | object
  ): Promise<T | undefined> => {
    if (this.loading === true) {
      return;
    }
    return await this.callApiWithStateEvenLoading<T>(callbackFn, params);
  };

  callApiWithStateEvenLoading = async <T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackFn: (...args: any[]) => Promise<T>,
    params?: number | string | object
  ): Promise<T> => {
    this.setLoading(true);
    this.setError(undefined);

    let result: T = {} as T;
    try {
      result = await callbackFn(params);
    } catch (error) {
      this.setError(error);
      throw error;
    } finally {
      this.setLoading(false);
    }
    return result;
  };

  callApiWithConfig = async <T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callbackFn: (...args: any[]) => Promise<T>,
    params?: number | string | object,
    config: CallApiConfig = {
      evenLoading: false,
      withDimmed: false,
    }
  ): Promise<T | undefined> => {
    if (!config?.evenLoading && this.loading) {
      return;
    }

    this.setLoading(true);
    this.setError(undefined);
    config?.withDimmed && this.root?.dimStore.activate();

    let result: T = {} as T;
    try {
      result = await callbackFn(params);
    } catch (error) {
      this.setError(error);
      throw error;
    } finally {
      this.setLoading(false);
      config?.withDimmed && this.root?.dimStore.deactivate();
    }
    return result;
  };

  constructor(root: RootStore) {
    makeObservable(this, {
      loading: observable,
      error: observable,
      root: observable,
      setLoading: action,
      setError: action,
    });
    this.root = root;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError(error: any) {
    this.error = error;
  }
}

export default BaseStore;
