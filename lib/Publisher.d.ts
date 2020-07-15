import { Connection } from './Connection';
import { IVideoDimension } from './Stream';
import { Observable, Subject } from 'rxjs';
import { WebrtcDispose } from './Webrtc';
export declare type WebrtcAddStream = (pc: RTCPeerConnection) => void;
export interface IPublishProperties {
    videoDimensions?: IVideoDimension;
    typeOfVideo: string;
    frameRate?: number;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    doLoopback: boolean;
    webrtcAddStream: WebrtcAddStream;
    webrtcDispose: WebrtcDispose;
}
export declare class Publisher extends Connection {
    forceUnpublished$: Subject<{}>;
    publish(properties: IPublishProperties): Observable<Publisher>;
    private createRespondToSdp;
}
//# sourceMappingURL=Publisher.d.ts.map
