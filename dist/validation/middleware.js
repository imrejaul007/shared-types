"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateQuery = validateQuery;
exports.validateParams = validateParams;
exports.validate = validate;
function formatZodError(error) {
    return {
        errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
        })),
    };
}
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation Error',
                code: 'VALIDATION_ERROR',
                ...formatZodError(result.error),
            });
        }
        req.body = result.data;
        next();
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation Error',
                code: 'QUERY_VALIDATION_ERROR',
                ...formatZodError(result.error),
            });
        }
        req.query = result.data;
        next();
    };
}
function validateParams(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation Error',
                code: 'PARAMS_VALIDATION_ERROR',
                ...formatZodError(result.error),
            });
        }
        req.params = result.data;
        next();
    };
}
function validate(schemas) {
    return (req, res, next) => {
        const errors = [];
        if (schemas.body) {
            const result = schemas.body.safeParse(req.body);
            if (!result.success) {
                errors.push({ location: 'body', errors: formatZodError(result.error).errors });
            }
            else {
                req.body = result.data;
            }
        }
        if (schemas.query) {
            const result = schemas.query.safeParse(req.query);
            if (!result.success) {
                errors.push({ location: 'query', errors: formatZodError(result.error).errors });
            }
            else {
                req.query = result.data;
            }
        }
        if (schemas.params) {
            const result = schemas.params.safeParse(req.params);
            if (!result.success) {
                errors.push({ location: 'params', errors: formatZodError(result.error).errors });
            }
            else {
                req.params = result.data;
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Validation Error',
                code: 'VALIDATION_ERROR',
                errors,
            });
        }
        next();
    };
}
//# sourceMappingURL=middleware.js.map