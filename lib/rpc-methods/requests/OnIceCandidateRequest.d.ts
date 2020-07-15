import { RPCRequestMethod } from '../base/RPCRequestMethod';
export interface IIceCandidateRequestParam {
    endpointName: string;
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
}
export interface IIceCandidateResponseParam {
    sessionId: string;
}
export declare class OnIceCandidateRequest extends RPCRequestMethod<
    IIceCandidateRequestParam,
    IIceCandidateResponseParam
> {
    param: IIceCandidateRequestParam;
    constructor(param: IIceCandidateRequestParam);
}
//# sourceMappingURL=OnIceCandidateRequest.d.ts.map
