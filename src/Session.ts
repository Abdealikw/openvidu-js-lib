import { Observable, timer, Subject, from, of, merge } from 'rxjs';
import { OpenviduSocketManager } from './rpc/openvidu-socket';
import {
    map,
    switchMap,
    tap,
    mergeMap,
    finalize,
    filter,
    mapTo,
    repeatWhen,
    retryWhen,
    catchError,
} from 'rxjs/operators';
import { IConnectionOptions } from './interfaces/ConnectionOptions';
import { Publisher } from './Publisher';
import { Subscriber } from './Subscriber';
import { ISessionBuilder } from './SessionBuilder';
import { JoinRoomRequest } from './rpc-methods/requests/JoinRoomRequest';
import { ParticipantJoinedNotification } from './rpc-methods/notifications/ParticipantJoinedNotification';
import {
    ParticipantPublishedNotification,
    IParticipantPublishedNotificationParam,
} from './rpc-methods/notifications/ParticipantPublishedNotification';
import { PingRequest } from './rpc-methods/requests/PingRequest';
import { LeaveRoomRequest } from './rpc-methods/requests/LeaveRoomRequest';
import { ParticipantLeftNotification } from './rpc-methods/notifications/ParticipantLeftNotification';
import { ParticipantUnpublishedNotification } from './rpc-methods/notifications/ParticipantUnpublishedNotification';
import { getLogger } from './Logger';
import { configureRetryOnTimeout } from './rpc/utils';

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

export class Session implements ISession, IConnectionSession {
    public rpcSessionId?: string;
    public publisher?: Publisher;
    public subscriberMap: Map<string, Subscriber> = new Map();
    public leavingSessionSubject = new Subject();

    public socketManager: OpenviduSocketManager;

    private onPublishSubject: Subject<Subscriber> = new Subject();
    private onUnPublishSubject: Subject<Subscriber> = new Subject();
    private onJoinSubject: Subject<Subscriber> = new Subject();
    private onLeftSubject: Subject<Subscriber> = new Subject();

    constructor(public builder: ISessionBuilder) {
        this.socketManager = this.builder.config.socketManager;
    }

    public onLeavingSession() {
        return this.leavingSessionSubject.asObservable();
    }

    public onParticipantJoin() {
        return this.onJoinSubject.asObservable();
    }

    public onPublish() {
        return this.onPublishSubject.asObservable();
    }

    public onLeft() {
        return this.onLeftSubject.asObservable();
    }

    public onParticipantUnPublish() {
        return this.onUnPublishSubject.asObservable();
    }

    public join(): Observable<ISession> {
        return new Observable<ISession>(sub => {
            const nextError = {
                error: (err: any) => sub.error(err),
            };
            const subscriptions = this.sendPing().subscribe(nextError);
            subscriptions.add(this.onParticipantJoined().subscribe(nextError));
            subscriptions.add(this.onParticipantPublished().subscribe(nextError));
            subscriptions.add(this.onParticipantLeft().subscribe(nextError));
            subscriptions.add(this.onParticipantUnpublished().subscribe(nextError));

            subscriptions.add(this.joinRoom().subscribe(msg => sub.next(msg), err => sub.error(err)));
            return () => {
                getLogger().log('Unsubscribing.. Join');
                this.leavingSessionSubject.next();
                subscriptions.add(
                    this.leaveRoom()
                        .pipe(
                            finalize(() => subscriptions.unsubscribe()),
                            catchError(err => {
                                getLogger().log('Leaving Room Error', err);
                                return of(err);
                            }),
                        )
                        .subscribe(),
                );
            };
        });
    }

    private leaveRoom() {
        return this.socketManager.sendRequestAndObserveOne(new LeaveRoomRequest());
    }

    private joinRoom() {
        const tokenMeta = this.builder.config.tokenMeta;
        const openviduConfig = this.builder.config.openviduConfig;

        const joinRoomRequest = new JoinRoomRequest({
            metadata: !tokenMeta.metadata ? '' : JSON.stringify(tokenMeta.metadata),
            platform: openviduConfig.platform,
            token: tokenMeta.tokenUrl,
            secret: tokenMeta.secret,
            session: tokenMeta.sessionId,
            recorder: tokenMeta.recorder,
        });

        return this.socketManager.sendRequestAndObserveOne(joinRoomRequest).pipe(
            map(res => this.builder.fromJoinRoomResponseParam(res!, this)),
            mergeMap(sess => {
                if (sess.subscriberMap.size > 0) {
                    const participantJoined = from(sess.subscriberMap.values()).pipe(
                        filter(sub => sub.streams !== undefined && sub.streams!.length > 0),
                        tap(sub => this.onPublishSubject.next(sub)),
                    );
                    return from(participantJoined.toPromise().then(_ => sess));
                }
                return of(sess);
            }),
        );
    }

    private onParticipantUnpublished() {
        const notificationObservable = this.socketManager.observeNotification(new ParticipantUnpublishedNotification());
        const subscriberPipeline = notificationObservable.pipe(
            map(param => this.subscriberMap.get(param!.connectionId)),
            filter(sub => sub !== undefined),
            tap(sub => this.onUnPublishSubject.next(sub)),
            tap(sub => sub!.streams!.shift()),
            mapTo(undefined),
        );
        const publisherPipeline = notificationObservable.pipe(
            filter(param => this.publisher!.connectionId === param!.connectionId),
            tap(() => this.publisher!.forceUnpublished$.next()),
            mapTo(undefined),
        );
        return merge(subscriberPipeline, publisherPipeline);
    }

    private onParticipantLeft() {
        return this.socketManager.observeNotification(new ParticipantLeftNotification()).pipe(
            map(param => this.subscriberMap.get(param!.connectionId)),
            filter(sub => sub !== undefined),
            tap(sub => this.onLeftSubject.next(sub)),
            tap(sub => this.subscriberMap.delete(sub!.connectionId)),
        );
    }

    private onParticipantJoined(): Observable<Subscriber> {
        return this.socketManager.observeNotification(new ParticipantJoinedNotification()).pipe(
            map(opt => this.addSubscriberConnection(opt!)),
            tap(sub => this.onJoinSubject.next(sub)),
        );
    }

    private onParticipantPublished(): Observable<Subscriber> {
        return this.socketManager.observeNotification(new ParticipantPublishedNotification()).pipe(
            map(opt => this.updateSubscriberStreams(opt!)),
            filter(sub => sub !== undefined),
            map(sub => sub!),
            tap(subscriber => this.onPublishSubject.next(subscriber)),
        );
    }

    private sendPing(): Observable<any> {
        const pingRequest = new PingRequest({
            interval: this.builder.config.pingInterval,
        });

        return this.socketManager.sendRequestAndObserveOne(pingRequest).pipe(
            retryWhen(configureRetryOnTimeout()),
            switchMap(() => {
                const interval = this.builder.config.pingInterval;
                return timer(interval).pipe(
                    tap(() => getLogger().log('Requesting...')),
                    switchMap(() => this.sendPing()),
                );
            }),
        );
    }

    private addSubscriberConnection(opt: IConnectionOptions): Subscriber {
        const connection = this.subscriberMap.get(opt.id);
        const subscriber = this.builder.config.subscriberBuilder.fromConnectionOptions(opt, this, connection);
        this.subscriberMap.set(opt.id, subscriber);
        return subscriber;
    }

    private updateSubscriberStreams(param: IParticipantPublishedNotificationParam): Subscriber | undefined {
        const connection = this.subscriberMap.get(param.id);
        if (!connection) {
            return;
        }
        const streamBuilder = this.builder.config.subscriberBuilder.connectionConfig.streamBuilder;
        connection.streams = param.streams.map(streamOpt =>
            streamBuilder.fromStreamOptionsServer(streamOpt, connection),
        );
        return connection;
    }
}
