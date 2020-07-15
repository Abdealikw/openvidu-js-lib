import { IRPCRequestMethod, IRPCNotificationMethod } from '../rpc-methods/base/methods';
import { Observable } from 'rxjs';
export interface ISocketConfig {
    url: string;
    websocketCtor: new (url: string, protocols?: string | string[]) => WebSocket | any;
    requestTimeout: number;
}
export declare class OpenviduSocketManager {
    private config;
    private socket;
    private idGenerator;
    constructor(config: ISocketConfig);
    observeNotification<P>(notification: IRPCNotificationMethod<P>): Observable<P | undefined>;
    sendRequestAndObserveOne<P, R>(request: IRPCRequestMethod<P, R>): Observable<R>;
    private configureRetryOnCloseEvent;
    private sendRequestAndObserveResponse;
    private sendRequest;
    private setupSocket;
    private observeResponse;
    private getSocketObservable;
    private getRequestId;
    private createIdGenerator;
    private range;
}
//# sourceMappingURL=openvidu-socket.d.ts.map
