import { Method } from './Method';
import { Service } from './Service';

export interface ParamObject {
  queryParams?: object;
  bodyParams?: object;
}

export interface Config {
  timeout?: number;
  returnValueWhenFail?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface BeApiRequest {
  url: string;
  method: Method;
  serviceName?: Service;
  params?: ParamObject;
  config?: Config;
}

export interface BeApiResponse<T> {
  successOrNot: string;
  statusCode: string;
  data?: T;
}

export interface PagingObject {
  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
}

export interface BeApiPagingResponse<T> extends BeApiResponse<T> {
  paging: PagingObject;
}

export type Sorting<T> = T & SortingRequest;
export type Paging<T> = T & PagingRequest;
export interface PagingRequest {
  page: number;
  size: number;
}

export interface SortingRequest {
  sort?: string;
}
