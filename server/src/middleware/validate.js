import { ApiError } from '../utils/api-error.js';

/**
 * Validates `req[source]` against a zod schema. Parsed values (trimmed,
 * coerced, defaults applied) are exposed on `req.valid[source]`, since
 * `req.query` is read-only in Express 5.
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      throw new ApiError(400, details[0].message, details);
    }
    req.valid = { ...req.valid, [source]: result.data };
    next();
  };
}
