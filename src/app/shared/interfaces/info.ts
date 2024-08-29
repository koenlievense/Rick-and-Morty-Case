export interface Info<T> {
  info: {
    count: number;
    next: null | string;
    pages: number;
    prev: null | string;
  };
  results: T;
}
