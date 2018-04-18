interface ApiResult<T> {
  seq: number;
  status: number;
  content: T;
}
