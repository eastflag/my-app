import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_PER_PAGE_LIST } from '../components/common/table/TableNumberPagination';

interface ObjectType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
}

const useCustomSearchParams = (paramConfig: ObjectType = {}, rowsPerPageLists: number[] = []) => {
  const [params, setParams] = useSearchParams();

  if (rowsPerPageLists.length === 0) {
    rowsPerPageLists = DEFAULT_PER_PAGE_LIST;
  }

  const searchAsObject = Object.fromEntries(new URLSearchParams(params));

  const searchParams: ObjectType = {};
  for (const [queryStringKey, paramTransformer] of Object.entries(paramConfig)) {
    let value = undefined;
    // For withDefaultWhenEmptyQueryString (PARAM Type, defaultValueWhenEmptyQueryString)
    if (typeof paramTransformer === 'object') {
      // When empty query string, set defaultValueWhenEmptyQueryString value
      if (Object.keys(searchAsObject).length === 0) {
        value = paramTransformer[1];
      } else {
        value = paramTransformer[0](searchAsObject[queryStringKey]);
      }
    } else {
      value = paramTransformer(searchAsObject[queryStringKey]);
    }

    // For page size in table pagination
    if (queryStringKey === 'size' && rowsPerPageLists.indexOf(value) < 0) {
      searchParams[queryStringKey] = rowsPerPageLists[0]; // Set first value when invalid page value comes
    } else {
      searchParams[queryStringKey] = value;
    }
  }

  const setSearchParams = (param: ObjectType = {}) => {
    const newParam: ObjectType = {};
    for (const [queryStringKey, value] of Object.entries(param)) {
      // When only key exists in paramConfig
      if (paramConfig[queryStringKey]) {
        if ((!Array.isArray(value) && value) || (Array.isArray(value) && value.length > 0)) {
          newParam[queryStringKey] = Array.isArray(value) ? value.toString() : value; // ['a','b'] => qp=a,b
        }
      }
    }
    setParams(newParam);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setSearchParam = (queryStringKey: string, value: any) => {
    if (value) {
      params.set(queryStringKey, value);
    } else {
      params.delete(queryStringKey);
    }
    setParams(params);
  };

  return { searchParams, setSearchParams, setSearchParam };
};

export const PARAMS = {
  StringParam: (string = '') => string,
  BooleanParam: (string = '') => string === 'true',
  NumberParam: (string = '') => (string ? Number(string) : null),
  ArrayParam: (string: string) => string?.split(',') ?? [],
  // other transformation functions to map all data types
};

export const withDefaultWhenEmptyQueryString = (
  params: typeof PARAMS[keyof typeof PARAMS],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValueWhenEmptyQueryString: any
) => {
  return [params, defaultValueWhenEmptyQueryString];
};

export default useCustomSearchParams;
