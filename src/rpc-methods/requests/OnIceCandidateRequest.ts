import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

export interface IIceCandidateRequestParam {
    endpointName: string;
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
}

export interface IIceCandidateResponseParam {
    sessionId: string;
}

export class OnIceCandidateRequest extends RPCRequestMethod<IIceCandidateRequestParam, IIceCandidateResponseParam> {
    constructor(public param: IIceCandidateRequestParam) {
        super(RPCMethod.onIceCandidate);
    }
}
