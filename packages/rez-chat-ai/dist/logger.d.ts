declare class Logger {
    private enableDebug;
    private log;
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string, context?: Record<string, unknown>): void;
}
export declare const logger: Logger;
export default logger;
//# sourceMappingURL=logger.d.ts.map