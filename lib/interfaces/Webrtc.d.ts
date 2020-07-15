import { IWebrtcBuilder } from '../types';
import { Observable } from 'rxjs';
export interface IWebrtcConfig {
    webrtcBuilder: IWebrtcBuilder;
    rtcConfig: RTCConfiguration;
}
export declare class Webrtc {
    peerConnection: RTCPeerConnection;
    constructor(config: IWebrtcConfig);
    onIceCandidate(): Observable<RTCIceCandidate>;
    onIceConnectionStateChange(): Observable<RTCIceTransportState>;
    onSignalingStateChange(): Observable<RTCSignalingState>;
    onStableSignalingState(): Observable<RTCSignalingState>;
    generateOffer(offerOptions?: RTCOfferOptions): Promise<string>;
    processAnswer(sdpAnswer: string): Promise<void>;
    addIceCandidate(iceCandidate: RTCIceCandidate): Promise<void>;
    private isStableSignalingState;
}
//# sourceMappingURL=Webrtc.d.ts.map
