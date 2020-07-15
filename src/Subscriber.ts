import { Connection } from './Connection';
import { mapTo, map, finalize, takeUntil, filter } from 'rxjs/operators';
import { Observable, Subject, merge } from 'rxjs';
import { ReceiveVideoFromRequest } from './rpc-methods/requests/ReceiveVideoFromRequest';
import { WebrtcDispose, SendSDPToRemoteAndGetAnswer } from './Webrtc';
import { UnsubscribeFromVideoRequest } from './rpc-methods/requests/UnsubscribeFromVideoRequest';
import { getLogger } from './Logger';

export interface ISubscriberProperties {
    webrtcDispose: WebrtcDispose;
}

export class Subscriber extends Connection {
    public subscribeToStream(properties: ISubscriberProperties): Observable<Subscriber> {
        const respondToSdp = this.createRespondToSdp(properties);
        return this.setupWebrtc(respondToSdp, properties.webrtcDispose).pipe(
            takeUntil(
                merge(
                    this.session!.onParticipantUnPublish().pipe(filter(sub => sub.connectionId === this.connectionId)),
                    this.session!.onLeft().pipe(filter(sub => sub.connectionId === this.connectionId)),
                    this.session!.onLeavingSession(),
                ),
            ),
            finalize(() => {
                const session = this.session!;
                const unsubscriberFromVideoRequest = new UnsubscribeFromVideoRequest({
                    sender: this.connectionId,
                });
                session.socketManager
                    .sendRequestAndObserveOne(unsubscriberFromVideoRequest)
                    .toPromise()
                    .catch(getLogger().log);
            }),
            mapTo(this),
        );
    }

    private createRespondToSdp(properties: ISubscriberProperties): SendSDPToRemoteAndGetAnswer {
        return (sdp: string) => {
            const session = this.session!;
            const receiveVideoFromRequest = new ReceiveVideoFromRequest({
                sdpOffer: sdp,
                sender: this.streams![0].streamId,
            });
            return session.socketManager
                .sendRequestAndObserveOne(receiveVideoFromRequest)
                .pipe(map(res => res!.sdpAnswer));
        };
    }
}
