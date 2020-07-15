import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
export interface IRTCIceCandidateParam {
    candidate: string;
    component: RTCIceComponent | null;
    foundation: string | null;
    ip: string | null;
    port: number | null;
    priority: number | null;
    protocol: RTCIceProtocol | null;
    relatedAddress: string | null;
    relatedPort: number | null;
    sdpMLineIndex: number | null;
    sdpMid: string | null;
    tcpType: RTCIceTcpCandidateType | null;
    type: RTCIceCandidateType | null;
    usernameFragment: string | null;
    endpointName: string;
}
export declare class IceCandidateNotification extends RPCNotificationMethod<IRTCIceCandidateParam> {
    constructor();
}
//# sourceMappingURL=IceCandidateNotification.d.ts.map
