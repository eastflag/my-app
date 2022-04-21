import { action, makeObservable, observable, computed, runInAction } from 'mobx';
import RootStore from '../Store';
import BaseStore from '../BaseStore';
import { postServiceInstance } from '../../services/sample/PostService';
import { Post } from '../../services/sample/model/PostModel';
import { BeApiResponse } from '../../services/common/model/RestApi';

export interface PostItem {
  id: number | undefined;
  userId: number | undefined;
  title: string;
  body: string;
}

class PostItemStore extends BaseStore implements PostItem {
  id: number | undefined;
  userId: number | undefined;
  title = '';
  body = '';

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      id: observable,
      userId: observable,
      title: observable,
      body: observable,
      getLocation: computed,

      reset: action,
    });
  }

  get getLocation() {
    return (this.id || '') + ' / ' + (this.root?.postListStore.postList.length || '');
  }

  reset() {
    this.id = undefined;
  }

  async fetchApi(id: number) {
    const result: BeApiResponse<Post> | undefined = await this.callApiWithState<BeApiResponse<Post>>(
      postServiceInstance.getPostItem,
      id
    );

    if (result?.successOrNot === 'Y' && result?.data) {
      runInAction(() => {
        this.id = result.data?.id;
        this.userId = result.data?.userId;
        this.title = result.data?.title ?? '';
        this.body = result.data?.body ?? '';
      });
    }
  }
}

export default PostItemStore;
