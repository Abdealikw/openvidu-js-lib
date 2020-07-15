import Url from 'url-parse';
import { OpenviduSocketManager } from './rpc/openvidu-socket';
import { ITokenMetadata, IOpenViduConfig } from './types';
import { PublisherBuilder } from './PublisherBuilder';
import { SubscriberBuilder } from './SubscriberBuilder';
import { StreamBuilder } from './StreamBuilder';
import { SessionBuilder } from './SessionBuilder';
import { ISession } from './Session';
import { InvalidToken } from './errors/InvalidToken';
import { setLogger } from './Logger';

export class OpenVidu {
    private tokenMeta?: ITokenMetadata;
    private socketManager?: OpenviduSocketManager;
    private sessionBuilder?: SessionBuilder;

    private publisherBuilder?: PublisherBuilder;
    private subscriberBuilder?: SubscriberBuilder;
    private streamBuilder?: StreamBuilder;

    constructor(private openviduConfig: IOpenViduConfig) {
        if (openviduConfig.logger) {
            setLogger(openviduConfig.logger);
        }
    }

    public initSession(tokenUrl: string, metadata?: any): ISession {
        this.tokenMeta = this.parseTokenUrl(tokenUrl);
        this.tokenMeta.metadata = metadata;
        this.socketManager = new OpenviduSocketManager({
            url: this.tokenMeta.wsUri,
            websocketCtor: this.openviduConfig.websocketBuilder.websocketCtor,
            requestTimeout: 10000,
        });
        this.streamBuilder = new StreamBuilder();
        this.publisherBuilder = new PublisherBuilder({
            streamBuilder: this.streamBuilder,
        });
        this.subscriberBuilder = new SubscriberBuilder({
            streamBuilder: this.streamBuilder,
        });
        this.sessionBuilder = new SessionBuilder({
            socketManager: this.socketManager,
            publisherBuilder: this.publisherBuilder,
            subscriberBuilder: this.subscriberBuilder,
            tokenMeta: this.tokenMeta,
            openviduConfig: this.openviduConfig,
            pingInterval: 5000,
        });
        return this.sessionBuilder.build();
    }

    private parseTokenUrl(tokenUrl: string): ITokenMetadata {
        const url = new Url(tokenUrl, true);
        const queryMap = Object.keys(url.query).reduce((prev, key) => {
            prev.set(key, url.query[key]);
            return prev;
        }, new Map());
        const sessionId = queryMap.get('sessionId');
        if (!sessionId) {
            throw new InvalidToken('Invalid Token, sessionId not found');
        }
        const wsUri = `wss://${url.host}/openvidu`;
        const secret = queryMap.get('secret');
        const recorder = queryMap.get('recorder') ? true : false;
        const role = queryMap.get('role');

        if (!role) {
            throw new InvalidToken('Invalid Token, role not found');
        }

        const stunUrl = `stun:${url.hostname}:3478`;
        const iceServers: RTCIceServer[] = [{ urls: [stunUrl] }];

        const turnUsername = queryMap.get('turnUsername');
        const turnCredential = queryMap.get('turnCredential');

        if (turnUsername && turnCredential) {
            const turnUrl1 = `turn:${url.hostname}:3478`;
            const turnUrl2 = `${turnUrl1}?transport=tcp`;
            iceServers.push({
                credential: turnCredential,
                urls: [turnUrl1, turnUrl2],
                username: turnUsername,
            });
        }

        return {
            iceServers,
            recorder,
            role,
            secret: secret ? secret : '',
            sessionId,
            wsUri,
            tokenUrl,
        };
    }
}
