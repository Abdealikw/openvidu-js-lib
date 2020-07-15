import { IWebrtcBuilder } from './types';
import { Observable } from 'rxjs';
export interface IWebrtcConfig {
    webrtcBuilder: IWebrtcBuilder;
    rtcConfig: RTCConfiguration;
}
export declare type SendIceCandidateToRemote = (iceCandidate: RTCIceCandidate) => Observable<undefined>;
export declare type ReceiveIceCandidateFromRemote = () => Observable<RTCIceCandidate>;
export declare type SendSDPToRemoteAndGetAnswer = (sdp: string) => Observable<string>;
export declare type WebrtcBeforeGenerateOffer = (pc: RTCPeerConnection) => void;
export declare type WebrtcDispose = (pc: RTCPeerConnection) => void;
export declare class Webrtc {
    peerConnection: RTCPeerConnection;
    constructor(config: IWebrtcConfig);
    setupWebrtcConnection(
        sendIceCandidatesToRemote: SendIceCandidateToRemote,
        receiveIceCandidatesFromRemote: ReceiveIceCandidateFromRemote,
        sendOfferToRemoteAndGetAnswer: SendSDPToRemoteAndGetAnswer,
        webrtcDispose: WebrtcDispose,
        beforeOffer?: WebrtcBeforeGenerateOffer,
    ): Observable<void>;
    private onIceCandidate;
    private onIceConnectionStateChange;
    private onSignalingStateChange;
    private generateOffer;
    private processAnswer;
    private addIceCandidate;
}
//# sourceMappingURL=Webrtc.d.ts.map
