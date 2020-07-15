import { IBuilder } from './interfaces/Builder';
import { Session, ISession } from './Session';
import { PublisherBuilder } from './PublisherBuilder';
import { SubscriberBuilder } from './SubscriberBuilder';
import { OpenviduSocketManager } from './rpc/openvidu-socket';
import { ITokenMetadata, IOpenViduConfig } from './types';
import { Subscriber } from './Subscriber';
import { IJoinRoomResponseParam } from './rpc-methods/requests/JoinRoomRequest';

export interface ISessionBuilder {
    config: ISessionBuilderConfig;
    fromJoinRoomResponseParam(opt: IJoinRoomResponseParam, sessionObj?: ISession): ISession;
}

export interface ISessionBuilderConfig {
    publisherBuilder: PublisherBuilder;
    subscriberBuilder: SubscriberBuilder;
    socketManager: OpenviduSocketManager;
    tokenMeta: ITokenMetadata;
    openviduConfig: IOpenViduConfig;
    pingInterval: number;
}

export class SessionBuilder implements ISessionBuilder, IBuilder<ISession> {
    constructor(public config: ISessionBuilderConfig) {}

    public build() {
        return new Session(this);
    }

    public fromJoinRoomResponseParam(opt: IJoinRoomResponseParam, sessionObj?: Session): ISession {
        const session = !sessionObj ? this.build() : sessionObj;
        session.rpcSessionId = opt.sessionId;
        session.publisher = this.config.publisherBuilder.fromConnectionOptions(
            {
                id: opt.id,
                metadata: opt.metadata,
            },
            session,
        );
        session.subscriberMap = opt.value.reduce<Map<string, Subscriber>>((prev, curr) => {
            const subscriber = this.config.subscriberBuilder.fromConnectionOptions(curr, session);
            prev.set(curr.id, subscriber);
            return prev;
        }, session.subscriberMap);
        return session;
    }
}
