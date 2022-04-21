import BaseService from '../common/BaseService';
import { Method } from '../common/model/Method';
import { BeApiRequest, BeApiResponse } from '../common/model/RestApi';
import { Service } from '../common/model/Service';
import { Post } from './model/PostModel';

class PostService extends BaseService {
  public getPosts = async () => {
    let result: BeApiResponse<Post[]>;
    try {
      const beApiRequest: BeApiRequest = {
        method: Method.GET,
        url: `https://jsonplaceholder.typicode.com/posts`,
        serviceName: Service.MARKETPLACE,
      };
      result = await this.fnRest(beApiRequest);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result;
  };

  public getPostItem = async (id: number) => {
    let result: BeApiResponse<Post>;

    try {
      const beApiRequest: BeApiRequest = {
        method: Method.GET,
        url: `https://jsonplaceholder.typicode.com/posts/${id}`,
        serviceName: Service.MARKETPLACE,
      };

      result = await this.fnRest(beApiRequest);
    } catch (error) {
      console.log(error);
      throw error;
    }
    return result;
  };
}

export const postServiceInstance = new PostService();
