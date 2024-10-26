export interface ApiValidationError {
  ctx: {
    reason: string;
  };
  input: string;
  loc: string[];
  msg: string;
  type: string;
}
