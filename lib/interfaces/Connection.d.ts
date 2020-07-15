import { IStream } from './Stream';
import { IConnectionSession } from './Session';
import { Webrtc, IWebrtcConfig } from './Webrtc';
import { StreamBuilder } from './StreamBuilder';
import { Observable } from 'rxjs';
export interface IConnection {
    connectionId: string;
    data: string;
    streams?: IStream[];
    session?: IConnectionSession;
    webrtc?: Webrtc;
}
export declare type SendIceCandidateToServer = (connectionId: string, iceCandidate: RTCIceCandidate) => Observable<any>;
export declare type SendSDPToServerAndGetAnswer = (sdp: string) => Observable<string>;
export abstract class Connection implements IConnection {
    connectionId: string;
    data: string;
    streams?: IStream[];
    session?: IConnectionSession;
    webrtc?: Webrtc;
    protected sendIceCandidatesToServer(
        connectionId: string,
        iceCandidate: RTCIceCandidate,
    ): Observable<import('../rpc-methods/requests/OnIceCandidateRequest').IIceCandidateResponseParam | undefined>;
    protected setupWebrtc(
        webrtcConfig: IWebrtcConfig,
        sendSDPToServerAndGetAnswer: SendSDPToServerAndGetAnswer,
    ): Observable<import('../rpc-methods/requests/OnIceCandidateRequest').IIceCandidateResponseParam | undefined>;
}
export interface IConnectionBuilderConfig {
    streamBuilder: StreamBuilder;
}
//# sourceMappingURL=Connection.d.ts.map
