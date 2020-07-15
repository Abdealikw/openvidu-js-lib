import { IJSONRPCError } from '../rpc/jsonrpc-types';
import { BaseError } from './BaseError';

export class JsonRPCError extends BaseError implements IJSONRPCError {
    public code: number;
    public data?: any;

    constructor(error: IJSONRPCError) {
        super(error.message);
        this.code = error.code;
        this.data = error.data;
    }
}
