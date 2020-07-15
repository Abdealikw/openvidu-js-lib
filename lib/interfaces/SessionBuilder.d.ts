import { IBuilder } from './Builder';
import { Session, ISession } from './Session';
import { PublisherBuilder } from './PublisherBuilder';
import { SubscriberBuilder } from './SubscriberBuilder';
import { OpenviduSocketManager } from '../rpc/openvidu-socket';
import { ITokenMetadata, IOpenViduConfig } from '../types';
import { IJoinRoomResponseParam } from '../rpc-methods/requests/JoinRoomRequest';
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
export declare class SessionBuilder implements ISessionBuilder, IBuilder<ISession> {
    config: ISessionBuilderConfig;
    constructor(config: ISessionBuilderConfig);
    build(): Session;
    fromJoinRoomResponseParam(opt: IJoinRoomResponseParam, sessionObj?: Session): ISession;
}
//# sourceMappingURL=SessionBuilder.d.ts.map
