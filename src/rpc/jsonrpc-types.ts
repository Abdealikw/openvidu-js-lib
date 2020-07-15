interface IJSONRPCBase {
    jsonrpc: string;
}

type JSONRPCID = string | number | null;

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

const idInObject = (object: any): boolean => 'id' in object;
const methodInObject = (object: any): boolean => 'method' in object;
const resultInObject = (object: any): boolean => 'result' in object;
const errorInObject = (object: any): boolean => 'error' in object;

export const isOpenviduRequest = <P>(object: any): object is IOpenviduRequest<P> => {
    return methodInObject(object) && idInObject(object);
};
export const isOpenviduNotification = <P>(object: any): object is IOpenviduNotification<P> => {
    return methodInObject(object) && !idInObject(object);
};
export const isOpenviduResponse = <R>(object: any): object is IOpenviduResponse<R> => {
    return idInObject(object) && (resultInObject(object) || errorInObject(object));
};
