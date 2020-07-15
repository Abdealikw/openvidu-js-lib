import { IStream } from './Stream';
import { IConnectionSession } from './Session';
import { Webrtc, SendSDPToRemoteAndGetAnswer, WebrtcDispose, WebrtcBeforeGenerateOffer } from './Webrtc';
import { mapTo, filter, map } from 'rxjs/operators';
import { OnIceCandidateRequest } from './rpc-methods/requests/OnIceCandidateRequest';
import { IceCandidateNotification } from './rpc-methods/notifications/IceCandidateNotification';

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
    public connectionId: string = '';
    public streams?: IStream[];
    public session?: IConnectionSession;
    public webrtc?: Webrtc;

    public get data(): string {
        return this.privateData;
    }
    public set data(val: string) {
        this.privateData = val;
        const splittedData = val.split('%');
        if (splittedData[0]) {
            this.clientMetadata = JSON.parse(splittedData[0]);
        }
        if (splittedData[1]) {
            this.serverMetadata = JSON.parse(splittedData[1]);
        }
    }

    public clientMetadata?: any;
    public serverMetadata?: any;

    private privateData: string = '';

    protected sendIceCandidatesToRemote(iceCandidate: RTCIceCandidate) {
        const session = this.session!;
        const onIceCandidateRequest = new OnIceCandidateRequest({
            candidate: iceCandidate.candidate,
            endpointName: this.connectionId,
            sdpMLineIndex: iceCandidate.sdpMLineIndex,
            sdpMid: iceCandidate.sdpMid,
        });
        return session.socketManager.sendRequestAndObserveOne(onIceCandidateRequest);
    }

    protected receiveIceCandidateFromRemote() {
        const session = this.session!;
        return session.socketManager.observeNotification(new IceCandidateNotification()).pipe(
            filter(param => param !== undefined && param.endpointName === this.connectionId),
            map(param => param!),
            map(param => {
                const iceCandidate: RTCIceCandidate = {
                    candidate: param.candidate,
                    component: param.component,
                    foundation: param.foundation,
                    ip: param.ip,
                    port: param.port,
                    priority: param.priority,
                    protocol: param.protocol,
                    relatedAddress: param.relatedAddress,
                    relatedPort: param.relatedPort,
                    sdpMid: param.sdpMid,
                    sdpMLineIndex: param.sdpMLineIndex,
                    tcpType: param.tcpType,
                    usernameFragment: param.usernameFragment,
                    type: param.type,
                    toJSON: () => {
                        const candidateInit: RTCIceCandidateInit = {
                            candidate: param.candidate,
                            sdpMLineIndex: param.sdpMLineIndex,
                            sdpMid: param.sdpMid,
                            usernameFragment: param.usernameFragment ? param.usernameFragment : undefined,
                        };
                        return candidateInit;
                    },
                };
                return iceCandidate;
            }),
        );
    }

    protected setupWebrtc(
        sendSDPToRemoteAndGetAnswer: SendSDPToRemoteAndGetAnswer,
        webrtcDispose: WebrtcDispose,
        beforeOffer?: WebrtcBeforeGenerateOffer,
    ) {
        const session = this.session!;

        this.webrtc = new Webrtc({
            rtcConfig: {
                iceServers: session.builder.config.tokenMeta.iceServers,
            },
            webrtcBuilder: session.builder.config.openviduConfig.webrtcBuilder,
        });

        return this.webrtc.setupWebrtcConnection(
            ice => this.sendIceCandidatesToRemote(ice).pipe(mapTo(undefined)),
            () => this.receiveIceCandidateFromRemote(),
            sendSDPToRemoteAndGetAnswer,
            webrtcDispose,
            beforeOffer,
        );
    }
}
