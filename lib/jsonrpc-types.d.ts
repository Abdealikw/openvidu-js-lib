interface IJSONRPCBase {
    jsonrpc: string;
}
declare type JSONRPCID = string | number | null;
interface IJSONRPCIdentifier<I extends JSONRPCID> {
    id: I;
}
export interface IJSONRPCNotification<P> extends IJSONRPCBase {
    method: string;
    params?: P;
}
export interface IJSONRPCRequest<P, I extends JSONRPCID> extends IJSONRPCNotification<P>, IJSONRPCIdentifier<I> {}
export interface IJSONRPCError {
    code: number;
    message: string;
    data?: any;
}
export interface IJSONRPCResponse<R, I extends JSONRPCID> extends IJSONRPCBase, IJSONRPCIdentifier<I> {
    result?: R;
    error?: IJSONRPCError;
}
export interface IOpenviduRequest<P> extends IJSONRPCRequest<P, number> {}
export interface IOpenviduNotification<P> extends IJSONRPCNotification<P> {}
export interface IOpenviduResponse<R> extends IJSONRPCResponse<R, number> {}
export declare const isOpenviduRequest: <P>(object: any) => object is IOpenviduRequest<P>;
export declare const isOpenviduNotification: <P>(object: any) => object is IOpenviduNotification<P>;
export declare const isOpenviduResponse: <R>(object: any) => object is IOpenviduResponse<R>;
export {};
//# sourceMappingURL=jsonrpc-types.d.ts.map
