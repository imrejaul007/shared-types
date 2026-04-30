export declare const ruleName = "@rez/require-validation";
export declare const ruleDescription = "Require validation middleware on Express routes";
declare const _default: {
    meta: {
        type: string;
        docs: {
            description: string;
            category: string;
            recommended: boolean;
        };
        fixable: null;
        schema: {
            type: string;
            properties: {
                bodyRequired: {
                    type: string;
                };
                queryRequired: {
                    type: string;
                };
                strictMode: {
                    type: string;
                };
            };
            additionalProperties: boolean;
        }[];
    };
    create(context: {
        report: (msg: unknown) => void;
    }): {};
};
export default _default;
//# sourceMappingURL=eslint.d.ts.map