import { action, computed, makeObservable, observable } from 'mobx';
import { BeApiResponse } from '../../services/common/model/RestApi';
import { Post } from '../../services/sample/model/PostModel';
import { postServiceInstance } from '../../services/sample/PostService';
import BaseStore from '../BaseStore';
import RootStore from '../Store';

class PostListStore extends BaseStore {
  postList: Post[] = [];

  constructor(root: RootStore) {
    super(root);
    makeObservable(this, {
      postList: observable,

      getPostCount: computed,

      init: action,
      setPostList: action,
    });
  }

  get getPostCount() {
    return this.postList.length;
  }

  init() {
    console.log('init post list store');
  }

  setPostList(postList: Post[]) {
    this.postList = postList;
  }

  async fetchApi() {
    const result = await this.callApiWithState<BeApiResponse<Post[]>>(postServiceInstance.getPosts);

    if (result?.successOrNot === 'Y' && result?.data) {
      this.setPostList(result.data);
    }
  }
}

export default PostListStore;
