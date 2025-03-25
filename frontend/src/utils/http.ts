/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FetcherOptions extends Partial<RequestInit> {
  prefix?: string;
  apiEndpoint?: string;
}

export class Http {
  private apiEndpoint?: string;
  private prefix?: string;
  private fetchOptions?: Partial<RequestInit>;
  constructor(options?: FetcherOptions) {
    const { apiEndpoint, prefix, ...initOptions } = options ?? {};
    this.apiEndpoint = apiEndpoint;
    this.prefix = prefix ?? ''; //maybe dev
    this.fetchOptions = initOptions;
  }

  private concatUrl = (path: string) =>
    `${this.apiEndpoint}${this.prefix}${path}`;

  private generateParams = (url: string, params: Record<string, any>) => {
    const paramsArr: string[] = [];
    Object.keys(params).forEach((key) => {
      const value = typeof params[key] === 'undefined' ? '' : params[key];
      paramsArr.push([key, encodeURIComponent(value)].join('='));
    });
    return `${url}?${paramsArr.join('&')}`;
  };
  private mergeOptions = (
    method: string,
    data?: Record<string, any> | FormData,
    options?: RequestInit
  ) => {
    const result = {
      method,
      credentials: 'include' as const,
      ...(this.fetchOptions
        ? Object.assign(this.fetchOptions, options)
        : options),
    };
    if (data) {
      result.body = data instanceof FormData ? data : JSON.stringify(data);
    }
    return result;
  };

  private async parseFetch<T>(res: Response) {
    if (!res.ok) {
      const detail = (await res.json()) as T;
      throw new Error(String(detail));
    }
    try {
      const parseResult = (await res.json()) as T;
      return parseResult;
    } catch (err) {
      throw new Error('response with no body');
    }
  }

  async get<T>(
    path: string,
    data?: Record<string, any>,
    options?: RequestInit
  ) {
    return await this.parseFetch<T>(
      await fetch(
        data
          ? this.generateParams(this.concatUrl(path), data)
          : this.concatUrl(path),
        this.mergeOptions('GET', options)
      )
    );
  }

  async getRaw(
    path: string,
    data?: Record<string, any>,
    options?: RequestInit
  ) {
    return await fetch(
      data
        ? this.generateParams(this.concatUrl(path), data)
        : this.concatUrl(path),
      this.mergeOptions('GET', options)
    );
  }

  async post<T>(
    path: string,
    data?: Record<string, any>,
    options?: RequestInit
  ) {
    return await this.parseFetch<T>(
      await fetch(
        this.concatUrl(path),
        this.mergeOptions("POST", data, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers
            }
        })
      )
    );
  }

  async postRaw(
    path: string,
    data?: Record<string, any>,
    options?: RequestInit
  ) {
    return await fetch(
      this.concatUrl(path),
      this.mergeOptions("POST", data, {
          ...options,
          headers: {
              ...options?.headers
          }
      })
    );
  }

  async postFormData<T>(path: string, data: FormData) {
    return await this.parseFetch<T>(
      await fetch(
        this.concatUrl(path),
        this.mergeOptions('POST', data, {
          headers: {
            credentials: 'include',
          },
        })
      )
    );
  }

  async put<T>(
    path: string,
    data?: Record<string, any> | FormData,
    options?: RequestInit
  ) {
    return await this.parseFetch<T>(
      await fetch(
        this.concatUrl(path),
        this.mergeOptions(
          'PUT',
          data,
          data instanceof FormData
            ? {
                headers: {
                  credentials: 'include',
                },
              }
            : options
        )
      )
    );
  }

  async delete<T>(
    path: string,
    data?: Record<string, any>,
    options?: RequestInit
  ) {
    return await this.parseFetch<T>(
      await fetch(
        this.concatUrl(path),
        this.mergeOptions('DELETE', data, options)
      )
    );
  }
}

export const http = new Http({
  prefix: '',
  apiEndpoint: 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json, text/plain, */*',
  },
});
