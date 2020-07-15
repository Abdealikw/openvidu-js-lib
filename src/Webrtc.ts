import { IWebrtcBuilder } from './types';
import { Observable, fromEvent, of, from } from 'rxjs';
import { map, filter, takeWhile, tap, mergeMap } from 'rxjs/operators';
import { getLogger } from './Logger';

export interface IWebrtcConfig {
    webrtcBuilder: IWebrtcBuilder;
    rtcConfig: RTCConfiguration;
}

export type SendIceCandidateToRemote = (iceCandidate: RTCIceCandidate) => Observable<undefined>;
export type ReceiveIceCandidateFromRemote = () => Observable<RTCIceCandidate>;
export type SendSDPToRemoteAndGetAnswer = (sdp: string) => Observable<string>;
export type WebrtcBeforeGenerateOffer = (pc: RTCPeerConnection) => void;
export type WebrtcDispose = (pc: RTCPeerConnection) => void;

export class Webrtc {
    public peerConnection: RTCPeerConnection;

    constructor(config: IWebrtcConfig) {
        this.peerConnection = new config.webrtcBuilder.rtcPeerCtor(config.rtcConfig);

        this.onSignalingStateChange()
            .pipe(tap(state => getLogger().log('Signalling State Change: ', state)))
            .subscribe();
        this.onIceConnectionStateChange()
            .pipe(tap(state => getLogger().log('Ice connection state change: ', state)))
            .subscribe();
    }

    public setupWebrtcConnection(
        sendIceCandidatesToRemote: SendIceCandidateToRemote,
        receiveIceCandidatesFromRemote: ReceiveIceCandidateFromRemote,
        sendOfferToRemoteAndGetAnswer: SendSDPToRemoteAndGetAnswer,
        webrtcDispose: WebrtcDispose,
        beforeOffer?: WebrtcBeforeGenerateOffer,
    ) {
        return new Observable<void>(sub => {
            if (beforeOffer) {
                beforeOffer(this.peerConnection);
            }

            const receiveIceCandidatesFromRemote$ = receiveIceCandidatesFromRemote();
            const receiveIceCandidatesFromRemoteSubscription = receiveIceCandidatesFromRemote$
                .pipe(
                    mergeMap(iceCandidate => {
                        return this.onSignalingStateChange(state => state === 'stable').pipe(
                            mergeMap(_ => from(this.addIceCandidate(iceCandidate))),
                        );
                    }),
                )
                .subscribe({
                    error: err => sub.error(err),
                });

            const iceCandidateRelaySubscription = this.onIceCandidate()
                .pipe(
                    mergeMap(iceCandidate => {
                        return this.onSignalingStateChange(state => state === 'stable').pipe(
                            mergeMap(_ => sendIceCandidatesToRemote(iceCandidate)),
                        );
                    }),
                )
                .subscribe({
                    error: err => sub.error(err),
                });

            const webrtcSetupPromise = this.generateOffer()
                .then(sdp => sendOfferToRemoteAndGetAnswer(sdp).toPromise())
                .then(sdpAnswer => this.processAnswer(sdpAnswer));

            const subscription = from(webrtcSetupPromise).subscribe(msg => sub.next(msg), err => sub.error(err));
            return () => {
                getLogger().log('Unsubscribing.. Webrtc');
                subscription.unsubscribe();
                iceCandidateRelaySubscription.unsubscribe();
                receiveIceCandidatesFromRemoteSubscription.unsubscribe();
                webrtcDispose(this.peerConnection);
                this.peerConnection.close();
            };
        });
    }

    private onIceCandidate(): Observable<RTCIceCandidate> {
        return fromEvent<RTCPeerConnectionIceEvent>(this.peerConnection, 'icecandidate').pipe(
            takeWhile(e => e.candidate !== null),
            map(e => e.candidate!),
        );
    }

    private onIceConnectionStateChange(filterPredicate?: (state: RTCIceConnectionState) => boolean) {
        if (filterPredicate && filterPredicate(this.peerConnection.iceConnectionState)) {
            return of(this.peerConnection.iceConnectionState);
        }
        return fromEvent<Event>(this.peerConnection, 'iceconnectionstatechange').pipe(
            map(_ => this.peerConnection.iceConnectionState),
            filter(state => (!filterPredicate ? true : filterPredicate(state))),
        );
    }

    private onSignalingStateChange(filterPredicate?: (state: RTCSignalingState) => boolean) {
        if (filterPredicate && filterPredicate(this.peerConnection.signalingState)) {
            return of(this.peerConnection.signalingState);
        }
        return fromEvent<Event>(this.peerConnection, 'signalingstatechange').pipe(
            map(_ => this.peerConnection.signalingState),
            filter(state => (!filterPredicate ? true : filterPredicate(state))),
        );
    }

    private generateOffer(offerOptions?: RTCOfferOptions): Promise<string> {
        return this.peerConnection
            .createOffer(offerOptions)
            .then(res => this.peerConnection.setLocalDescription(res))
            .then(_ => this.peerConnection.localDescription!.sdp);
    }

    private processAnswer(sdpAnswer: string): Promise<void> {
        const answer: RTCSessionDescriptionInit = {
            type: 'answer',
            sdp: sdpAnswer,
        };
        return this.peerConnection.setRemoteDescription(answer);
    }

    private addIceCandidate(iceCandidate: RTCIceCandidate): Promise<void> {
        return this.peerConnection.addIceCandidate(iceCandidate);
    }
}
