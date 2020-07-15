import { Observable, Subject } from 'rxjs';
import { OpenviduSocketManager } from './rpc/openvidu-socket';
import { Publisher } from './Publisher';
import { Subscriber } from './Subscriber';
import { ISessionBuilder } from './SessionBuilder';
export interface ISession {
    rpcSessionId?: string;
    publisher?: Publisher;
    subscriberMap: Map<string, Subscriber>;
    onParticipantJoin(): Observable<Subscriber>;
    onPublish(): Observable<Subscriber>;
    onParticipantUnPublish(): Observable<Subscriber>;
    onLeft(): Observable<Subscriber>;
    join(): Observable<ISession>;
}
export interface IConnectionSession {
    socketManager: OpenviduSocketManager;
    builder: ISessionBuilder;
    onLeavingSession: () => Observable<unknown>;
    onLeft: () => Observable<Subscriber>;
    onParticipantUnPublish: () => Observable<Subscriber>;
}
export declare class Session implements ISession, IConnectionSession {
    builder: ISessionBuilder;
    rpcSessionId?: string;
    publisher?: Publisher;
    subscriberMap: Map<string, Subscriber>;
    leavingSessionSubject: Subject<{}>;
    socketManager: OpenviduSocketManager;
    private onPublishSubject;
    private onUnPublishSubject;
    private onJoinSubject;
    private onLeftSubject;
    constructor(builder: ISessionBuilder);
    onLeavingSession(): Observable<{}>;
    onParticipantJoin(): Observable<Subscriber>;
    onPublish(): Observable<Subscriber>;
    onLeft(): Observable<Subscriber>;
    onParticipantUnPublish(): Observable<Subscriber>;
    join(): Observable<ISession>;
    private leaveRoom;
    private joinRoom;
    private onParticipantUnpublished;
    private onParticipantLeft;
    private onParticipantJoined;
    private onParticipantPublished;
    private sendPing;
    private addSubscriberConnection;
    private updateSubscriberStreams;
}
//# sourceMappingURL=Session.d.ts.map
