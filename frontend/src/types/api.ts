export interface ApiValidationError {
  ctx: {
    reason: string;
  };
  input: string;
  loc: string[];
  msg: string;
  type: string;
}

export interface ApiException {
  timestamp: string;
  status: number;
  message: string;
  path: string;
  details: string | object;
}
