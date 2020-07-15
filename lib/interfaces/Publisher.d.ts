import { Connection } from './Connection';
import { IVideoDimension } from './Stream';
import { Observable } from 'rxjs';
import { IWebrtcConfig } from './Webrtc';
export interface IPublishProperties {
    videoDimensions?: IVideoDimension;
    typeOfVideo: string;
    frameRate?: number;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    doLoopback: boolean;
}
export declare class Publisher extends Connection {
    private properties?;
    publish(properties: IPublishProperties): Observable<Publisher>;
    protected setupWebrtc(
        webrtcConfig: IWebrtcConfig,
    ): Observable<import('../rpc-methods/requests/OnIceCandidateRequest').IIceCandidateResponseParam | undefined>;
}
//# sourceMappingURL=Publisher.d.ts.map
