import { Connection } from './Connection';
import { IVideoDimension } from './Stream';
import { Observable, Subject, merge } from 'rxjs';
import { PublishVideoRequest } from './rpc-methods/requests/PublishVideoRequest';
import { map, mapTo, finalize, takeUntil } from 'rxjs/operators';
import { WebrtcDispose, SendSDPToRemoteAndGetAnswer } from './Webrtc';
import { UnpublishVideoRequest } from './rpc-methods/requests/UnpublishVideoRequest';
import { getLogger } from './Logger';

export type WebrtcAddStream = (pc: RTCPeerConnection) => void;

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

export class Publisher extends Connection {
    public forceUnpublished$ = new Subject();
    public publish(properties: IPublishProperties): Observable<Publisher> {
        const respondToSdp = this.createRespondToSdp(properties);
        return this.setupWebrtc(respondToSdp, properties.webrtcDispose, properties.webrtcAddStream).pipe(
            takeUntil(merge(this.forceUnpublished$.asObservable(), this.session!.onLeavingSession())),
            finalize(() => {
                const session = this.session!;
                session.socketManager
                    .sendRequestAndObserveOne(new UnpublishVideoRequest())
                    .toPromise()
                    .finally(() => {
                        this.streams!.shift();
                    })
                    .catch(getLogger().log);
            }),
            mapTo(this),
        );
    }

    private createRespondToSdp(properties: IPublishProperties): SendSDPToRemoteAndGetAnswer {
        return (sdp: string) => {
            const session = this.session!;

            const publishVideoRequest = new PublishVideoRequest({
                sdpOffer: sdp,
                typeOfVideo: properties.typeOfVideo,
                doLoopback: properties.doLoopback,
                hasAudio: properties.hasAudio,
                hasVideo: properties.hasVideo,
                audioActive: properties.audioActive,
                videoActive: properties.videoActive,
                videoDimensions: JSON.stringify(properties.videoDimensions),
                frameRate: properties.frameRate,
            });

            return session.socketManager.sendRequestAndObserveOne(publishVideoRequest).pipe(
                map(res => {
                    const streamBuilder = session.builder.config.publisherBuilder.connectionConfig.streamBuilder;
                    this.streams = !this.streams ? [] : this.streams;
                    const stream = streamBuilder.fromPublisherOptions(res!.id, properties, this);
                    this.streams.push(stream);
                    return res!.sdpAnswer;
                }),
            );
        };
    }
}
