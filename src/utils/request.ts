'use server';

import { IncomingMessage, ServerResponse } from 'http';
import { objectToQueryString } from './object';

type TParams = {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | Array<unknown>
    | undefined
    | null;
};

type TCache = 'force-cache' | 'no-store';

export interface IResponse<T> extends Response {
  code: number;
  data: T;
  errorType?: string;
}

interface IFetchParams {
  url: string;
  options: RequestInit;
  req?: IncomingMessage;
  res?: ServerResponse;
}

const fetchData = async <T>({
  url,
  options,
}: IFetchParams): Promise<IResponse<T>> => {
  try {
    const defaultHeaders = new Headers({
      accept: 'application/json',
      'Content-Type': 'application/json',
    });

    const result = await fetch(`${process.env.FETCH_ENTRY}${url}`, {
      headers: defaultHeaders,
      ...options,
    });

    if (!result.ok) {
      throw {
        code: result.status,
        errorType: 'network',
        data: result.statusText,
      };
    }

    const json = await result.json();

    if (json.code !== 200) {
      throw {
        errorType: 'backend',
        ...json,
      };
    }

    console.log(`Success : ${options.method} ${url}`);

    return json;
  } catch (error: any) {
    if (error.errorType === 'network') {
      console.log(`Network Error ${error.code} : ${options.method} ${url}`);
    }

    if (error.errorType === 'backend') {
      console.log(`Backend Error ${error.code} : ${options.method} ${url}`);
    }

    return error;
  }
};

export interface IRequestParams {
  method: string;
  url: string;
  searchParams?: TParams;
  body?: TParams;
  req?: IncomingMessage;
  res?: ServerResponse;
  cache?: TCache;
}

const request = async <T>({
  method,
  url,
  searchParams,
  body,
  req,
  res,
  cache = 'no-store',
}: IRequestParams): Promise<IResponse<T>> => {
  const requestOptions: RequestInit = {
    method,
    cache,
    body: JSON.stringify(body),
  };

  return fetchData<T>({
    url: `${url}${objectToQueryString(searchParams)}`,
    options: requestOptions,
    req,
    res,
  });
};

export default request;
