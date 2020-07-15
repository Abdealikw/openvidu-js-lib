export declare type WebrtcCtor = new (configuration?: RTCConfiguration) => RTCPeerConnection | any;
export declare type WebsocketCtor = new (url: string, protocols?: string | string[]) => WebSocket | any;
export interface IWebrtcBuilder {
    rtcPeerCtor: WebrtcCtor;
}
export interface IWebsocketBuilder {
    websocketCtor: WebsocketCtor;
}
export interface ITokenMetadata {
    sessionId: string;
    wsUri: string;
    secret: string;
    recorder: boolean;
    role: string;
    iceServers: RTCIceServer[];
    tokenUrl: string;
    metadata?: any;
}
export interface ILogger {
    log(message?: any, ...optionalParams: any[]): void;
}
export interface IOpenViduConfig {
    websocketBuilder: IWebsocketBuilder;
    platform: string;
    webrtcBuilder: IWebrtcBuilder;
    logger?: ILogger;
}
//# sourceMappingURL=types.d.ts.map
