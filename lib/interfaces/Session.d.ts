import { Observable } from 'rxjs';
import { OpenviduSocketManager } from '../rpc/openvidu-socket';
import { Publisher } from './Publisher';
import { Subscriber } from './Subscriber';
import { ISessionBuilder } from './SessionBuilder';
export interface ISession {
    rpcSessionId?: string;
    publisher?: Publisher;
    subscriberMap: Map<string, Subscriber>;
    onPublish(): Observable<Subscriber>;
    join(): Observable<ISession>;
}
export interface IConnectionSession {
    socketManager: OpenviduSocketManager;
    builder: ISessionBuilder;
}
export declare class Session implements ISession, IConnectionSession {
    builder: ISessionBuilder;
    rpcSessionId?: string;
    publisher?: Publisher;
    subscriberMap: Map<string, Subscriber>;
    socketManager: OpenviduSocketManager;
    private onPublishSubject;
    constructor(builder: ISessionBuilder);
    onPublish(): Observable<Subscriber>;
    join(): Observable<ISession>;
    private setupListeners;
    private leaveRoom;
    private joinRoom;
    private reconnect;
    private onParticipantJoined;
    private onParticipantPublished;
    private onIceCandidateReceive;
    private getConnectionForId;
    private setupPing;
    private addOrUpdateSubscriberConnection;
}
//# sourceMappingURL=Session.d.ts.map
