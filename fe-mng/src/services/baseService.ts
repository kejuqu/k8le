import { isFunction } from 'lodash';

import { request, RequestOptions } from '@umijs/max';

type ServiceConfig = {
  baseFormat: (response: Record<string, unknown>) => unknown;
};

export type RequestConfig<T = any> = RequestOptions & {
  format?: (response: Record<string, unknown>) => T;
};

export class BaseService {
  protected readonly config?: ServiceConfig;

  constructor(config?: ServiceConfig) {
    this.config = config;
  }

  baseRequest<T = any>(method: string) {
    return async <R = T>(
      url: string,
      body: Record<string, any> = {},
      options: RequestConfig<R> = {},
    ) => {
      const { baseFormat } = this.config || {};
      const { format, ...restOpt } = options || {};
      const finallyFormat = format || baseFormat;

      const response = await request<R>(url, {
        method,
        data: body,
        ...restOpt,
      });

      const result = isFunction(finallyFormat)
        ? finallyFormat(response as any)
        : response;

      return result as R;
    };
  }

  protected get = this.baseRequest('GET');
  protected put = this.baseRequest('PUT');
  // del 为 delete 方法，避免关键词冲突
  protected del = this.baseRequest('DELETE');
  protected post = this.baseRequest('POST');
  protected patch = this.baseRequest('PATCH');

  postWithUpload<T>(
    url: string,
    body: Record<string, any>,
    options: RequestConfig<T> = {},
  ) {
    const formData = new FormData();

    Object.keys(body).forEach((key) => {
      const value = body[key];
      if (value instanceof Array) {
        value.forEach((item: any) => {
          formData.append(key, item);
        });
        return;
      }
      formData.append(key, body[key]);
    });

    return request<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      method: 'POST',
    }) as any;
  }
}

export default BaseService;
