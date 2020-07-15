import { RPCRequestMethod } from '../base/RPCRequestMethod';
export interface IReceiveVideoFromRequestParam {
    sender: string;
    sdpOffer: string;
}
export interface IReceiveVideoFromResponseParam {
    sdpAnswer: string;
}
export declare class ReceiveVideoFromRequest extends RPCRequestMethod<
    IReceiveVideoFromRequestParam,
    IReceiveVideoFromResponseParam
> {
    param: IReceiveVideoFromRequestParam;
    constructor(param: IReceiveVideoFromRequestParam);
}
//# sourceMappingURL=ReceiveVideoFromRequest.d.ts.map
