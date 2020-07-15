import { RPCRequestMethod } from '../base/RPCRequestMethod';
export interface IPingRequestParam {
    interval: number;
}
declare type PingResponseValue = 'pong';
export interface IPingResponseParam {
    value: PingResponseValue;
}
export declare class PingRequest extends RPCRequestMethod<IPingRequestParam, IPingResponseParam> {
    param: IPingRequestParam;
    constructor(param: IPingRequestParam);
}
export {};
//# sourceMappingURL=PingRequest.d.ts.map
