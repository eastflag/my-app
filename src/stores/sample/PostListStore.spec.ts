import { BeApiResponse } from '../../services/common/model/RestApi';
import { Post } from '../../services/sample/model/PostModel';
import { postServiceInstance } from '../../services/sample/PostService';
import RootStore from '../Store';
import PostListStore from './PostListStore';

const rootStore = new RootStore();
const postListStore = new PostListStore(rootStore);

jest.mock('../../services/sample/PostService');
const mockedPostApi = postServiceInstance as jest.Mocked<typeof postServiceInstance>;

describe('test code', () => {
  it('test it', async () => {
    expect(postListStore.postList).toEqual([]);
  });
});

// test with async call
describe('test fetch', () => {
  it('test fetch', async () => {
    const response: BeApiResponse<Post[]> = {
      successOrNot: 'Y',
      statusCode: 'SUCCESS',
      data: [
        {
          id: 1,
          userId: 1,
          title: 'title',
          body: 'bod',
        },
      ],
    };

    mockedPostApi.getPosts.mockResolvedValue(response);

    await postListStore.fetchApi();

    expect(postListStore.loading).toEqual(false);
    expect(postListStore.postList).toEqual(response.data); // BaseStore 값 조회 테스트
  });
});
