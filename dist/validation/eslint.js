"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleDescription = exports.ruleName = void 0;
exports.ruleName = '@rez/require-validation';
exports.ruleDescription = 'Require validation middleware on Express routes';
exports.default = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Require validation middleware on Express routes',
            category: 'Security',
            recommended: true,
        },
        fixable: null,
        schema: [
            {
                type: 'object',
                properties: {
                    bodyRequired: { type: 'boolean' },
                    queryRequired: { type: 'boolean' },
                    strictMode: { type: 'boolean' },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        return {};
    },
};
//# sourceMappingURL=eslint.js.map