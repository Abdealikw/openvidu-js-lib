import { Observable } from 'rxjs';
import { IConnectionOptions } from './interfaces/ConnectionOptions';
export interface IPingRequestParam {
    interval: number;
}
declare type PingResponseValue = 'pong';
export interface IPingResponseParam {
    value: PingResponseValue;
}
export interface IEventReasonParam {
    connectionId: string;
    reason: string;
}
export interface IRecordingEventParam {
    id: string;
    name: string;
}
export interface ISendMessageParam {
    from: string;
    type: string;
    data: string;
}
export interface IStreamPropertyChangeParam extends IStreamPropertyChangedRequestParam {
    connectionId: string;
}
export interface IFilterEventDispatchedParam {
    connectionId: string;
    streamId: string;
    eventType: string;
    data: object;
}
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
export interface IMediaErrorParam {
    error: any;
}
export interface IJoinRoomRequestParam {
    token: string;
    session: string;
    platform?: string;
    metadata?: string;
    secret?: string;
    recorder?: boolean;
}
export interface IJoinRoomResponseParam {
    id: string;
    createdAt?: number;
    metadata: string;
    sessionId: string;
    value: IConnectionOptions[];
}
export interface IIceCandidateRequestParam {
    endpointName: string;
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
}
export interface IIceCandidateResponseParam {
    sessionId: string;
}
export interface IStreamPropertyChangedRequestParam {
    streamId: string;
    property: string;
    newValue: string;
    reason: string;
}
export interface IUnsubscribeRequestParam {
    sender: string;
}
export interface IForceDisconnectRequestParam {
    connectionId: string;
}
export interface ISendMessageRequestParam {
    message: string;
}
export interface IForceUnpublishRequestParam {
    streamId: string;
}
export interface IPublishVideoRequestParam {
    sdpOffer: string;
    doLoopback: boolean;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    typeOfVideo: string;
    frameRate?: number;
    videoDimensions?: string;
    filter?: undefined;
}
export interface IPublishVideoResponseParam {
    sdpAnswer: string;
    id: string;
    createdAt: number;
}
export interface IReceiveVideoFromRequestParam {
    sender: string;
    sdpOffer: string;
}
export interface IReceiveVideoFromResponseParam {
    sdpAnswer: string;
}
export interface IEventObservers {
    participantJoined: Observable<IConnectionOptions | undefined>;
    participantPublished: Observable<IConnectionOptions | undefined>;
    participantUnpublished: Observable<IEventReasonParam | undefined>;
    participantLeft: Observable<IEventReasonParam | undefined>;
    participantEvicted: Observable<IEventReasonParam | undefined>;
    recordingStarted: Observable<IRecordingEventParam | undefined>;
    recordingStopped: Observable<IRecordingEventParam | undefined>;
    sendMessage: Observable<ISendMessageParam | undefined>;
    streamPropertyChanged: Observable<IStreamPropertyChangeParam | undefined>;
    filterEventDispatched: Observable<IFilterEventDispatchedParam | undefined>;
    iceCandidate: Observable<IRTCIceCandidateParam | undefined>;
    mediaError: Observable<IMediaErrorParam | undefined>;
}
export {};
//# sourceMappingURL=socket-events.d.ts.map
