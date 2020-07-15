import { IStream } from './Stream';
import { IConnectionSession } from './Session';
import { Webrtc, SendSDPToRemoteAndGetAnswer, WebrtcDispose, WebrtcBeforeGenerateOffer } from './Webrtc';
export interface IConnection {
    connectionId: string;
    data: string;
    clientMetadata?: any;
    serverMetadata?: any;
    streams?: IStream[];
    session?: IConnectionSession;
    webrtc?: Webrtc;
}
export abstract class Connection implements IConnection {
    connectionId: string;
    streams?: IStream[];
    session?: IConnectionSession;
    webrtc?: Webrtc;
    data: string;
    clientMetadata?: any;
    serverMetadata?: any;
    private privateData;
    protected sendIceCandidatesToRemote(
        iceCandidate: RTCIceCandidate,
    ): import('rxjs').Observable<import('./rpc-methods/requests/OnIceCandidateRequest').IIceCandidateResponseParam>;
    protected receiveIceCandidateFromRemote(): import('rxjs').Observable<RTCIceCandidate>;
    protected setupWebrtc(
        sendSDPToRemoteAndGetAnswer: SendSDPToRemoteAndGetAnswer,
        webrtcDispose: WebrtcDispose,
        beforeOffer?: WebrtcBeforeGenerateOffer,
    ): import('rxjs').Observable<void>;
}
//# sourceMappingURL=Connection.d.ts.map
