import { ApiError } from "../lib/ApiError.js";

export const validate = (schema) => (req, _res, next) => {
  const result = schema(req);

  if (!result.success) {
    next(new ApiError(400, "Validation failed", result.errors));
    return;
  }

  req.validated = result.data;
  next();
};
