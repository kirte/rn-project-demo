export type ApiResult<T> =
  | { type: "Success"; data: T; status: number }
  | { type: "Error"; message: string; status?: number; details?: any }
  | { type: "NetworkError"; message: string }
  | { type: "Loading" };
