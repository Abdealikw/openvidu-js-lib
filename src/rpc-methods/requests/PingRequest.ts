import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

export interface IPingRequestParam {
    interval: number;
}
type PingResponseValue = 'pong';
export interface IPingResponseParam {
    value: PingResponseValue;
}

export class PingRequest extends RPCRequestMethod<IPingRequestParam, IPingResponseParam> {
    constructor(public param: IPingRequestParam) {
        super(RPCMethod.ping);
    }
}
