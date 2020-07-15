import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

export interface IReceiveVideoFromRequestParam {
    sender: string;
    sdpOffer: string;
}

export interface IReceiveVideoFromResponseParam {
    sdpAnswer: string;
}

export class ReceiveVideoFromRequest extends RPCRequestMethod<
    IReceiveVideoFromRequestParam,
    IReceiveVideoFromResponseParam
> {
    constructor(public param: IReceiveVideoFromRequestParam) {
        super(RPCMethod.receiveVideoFrom);
    }
}
