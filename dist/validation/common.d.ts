import { z } from 'zod';
export declare const objectIdSchema: z.ZodString;
export declare const uuidSchema: z.ZodString;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    order: "asc" | "desc";
    page: number;
    limit: number;
    sort?: string | undefined;
}, {
    order?: "asc" | "desc" | undefined;
    sort?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export declare const cursorPaginationSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    cursor?: string | undefined;
}, {
    limit?: number | undefined;
    cursor?: string | undefined;
}>;
export declare const dateRangeSchema: z.ZodEffects<z.ZodObject<{
    startDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
    endDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodDate]>>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
}, {
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
}>, {
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
}, {
    startDate?: string | Date | undefined;
    endDate?: string | Date | undefined;
}>;
export declare const searchSchema: z.ZodEffects<z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    query: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    q?: string | undefined;
    query?: string | undefined;
}, {
    q?: string | undefined;
    query?: string | undefined;
}>, string, {
    q?: string | undefined;
    query?: string | undefined;
}>;
export declare const urlSchema: z.ZodEffects<z.ZodString, string, string>;
export declare const isoDateSchema: z.ZodString;
export declare const slugSchema: z.ZodString;
export declare const positiveIntSchema: z.ZodNumber;
export type Pagination = z.infer<typeof paginationSchema>;
export type CursorPagination = z.infer<typeof cursorPaginationSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type Search = z.infer<typeof searchSchema>;
//# sourceMappingURL=common.d.ts.map