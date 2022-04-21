import { action, makeObservable, observable, computed, runInAction, configure } from 'mobx';
import RootStore from '../Store';
import BaseStore from '../BaseStore';

// configure({
//   enforceActions: 'always',
//   computedRequiresReaction: true,
//   reactionRequiresObservable: true,
//   observableRequiresReaction: true,
//   disableErrorBoundaries: true,
// });

export interface Account {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phones: Phone[] | undefined;
  interests: string[];
  subscription: boolean;
}

interface Phone {
  name: string;
  number: number;
}

class AccountStore extends BaseStore implements Account {
  name = '';
  email = '';
  confirmPassword = '';
  password = '';
  phones: any; // eslint-disable-line
  interests: string[] = [];
  subscription = false;

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      name: observable,
      email: observable,
      password: observable,
      confirmPassword: observable,
      phones: observable,
      interests: observable,
      subscription: observable,
    });
  }

  // with fake call for sample
  async fetchApi() {
    const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay));
    const result = await this.callApiWithState<unknown>(wait, 1500);
    runInAction(() => {
      this.name = '이름';
      this.email = 'a@b.com';
      this.confirmPassword = 'asdfasdf';
      this.password = 'asdfasdf';
      this.phones = [{ name: 'Cellphone', number: 1234 }];
      this.interests = ['game'];
      this.subscription = true;
    });
  }

  async updateApi() {
    const wait = (timeToDelay: number) => new Promise((resolve) => setTimeout(resolve, timeToDelay));
    const result = await this.callApiWithState<unknown>(wait, 3000);
    return true;
  }
}

export default AccountStore;
