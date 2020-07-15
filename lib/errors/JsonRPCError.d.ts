import { IJSONRPCError } from '../rpc/jsonrpc-types';
import { BaseError } from './BaseError';
export declare class JsonRPCError extends BaseError implements IJSONRPCError {
    code: number;
    data?: any;
    constructor(error: IJSONRPCError);
}
//# sourceMappingURL=JsonRPCError.d.ts.map
