import { filter, map, tap, take, timeout, retryWhen, repeatWhen } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
    IOpenviduRequest,
    IOpenviduResponse,
    IOpenviduNotification,
    isOpenviduNotification,
    isOpenviduResponse,
} from './jsonrpc-types';
import { IRPCRequestMethod, IRPCNotificationMethod } from '../rpc-methods/base/methods';
import { JsonRPCError } from '../errors/JsonRPCError';
import { Observable, of, throwError } from 'rxjs';
import { getLogger } from '../Logger';
import { configureRetryOnError } from './utils';

export interface ISocketConfig {
    url: string;
    websocketCtor: new (url: string, protocols?: string | string[]) => WebSocket | any;
    requestTimeout: number;
}

export class OpenviduSocketManager {
    private socket: WebSocketSubject<any>;
    private idGenerator: IterableIterator<number>;

    constructor(private config: ISocketConfig) {
        this.idGenerator = this.createIdGenerator();
        this.socket = this.setupSocket();
    }

    public observeNotification<P>(notification: IRPCNotificationMethod<P>) {
        return this.getSocketObservable().pipe(
            filter(val => isOpenviduNotification(val)),
            map(val => val as IOpenviduNotification<P>),
            filter(val => val.method === notification.method.toString()),
            tap(val => getLogger().log('received notification: ', JSON.stringify(val))),
            map(val => notification.mapParam(val.params)),
        );
    }

    public sendRequestAndObserveOne<P, R>(request: IRPCRequestMethod<P, R>) {
        const requestId = this.getRequestId();

        return this.sendRequestAndObserveResponse(request, requestId);
    }

    private configureRetryOnCloseEvent = (retryTimes: number = Number.POSITIVE_INFINITY) => {
        return configureRetryOnError(retryTimes, error => {
            const val = error.code && error.code;
            if (val) {
                getLogger().log(`CloseEvent... code:${error.code}... reason:${error.reason} Can Retry`);
                return of(val);
            }
        });
    };

    private sendRequestAndObserveResponse<P, R>(request: IRPCRequestMethod<P, R>, requestId: number) {
        return new Observable<R>(subscriber => {
            this.sendRequest(request, requestId);
            return this.observeResponse<R>(res => res.id === requestId)
                .pipe(
                    take(1),
                    timeout(this.config.requestTimeout),
                    map(val => {
                        if (val.error) {
                            throw new JsonRPCError(val.error);
                        }
                        return request.mapResult(val.result);
                    }),
                )
                .subscribe(subscriber);
        });
    }

    private sendRequest<P, R>(request: IRPCRequestMethod<P, R>, id: number) {
        const openviduReq: IOpenviduRequest<P> = {
            jsonrpc: '2.0',
            id,
            method: request.method.toString(),
        };

        if (request.param) {
            openviduReq.params = request.param;
        }
        getLogger().log('sending request:', JSON.stringify(openviduReq));
        this.socket.next(openviduReq);
    }

    private setupSocket() {
        return webSocket({
            WebSocketCtor: this.config.websocketCtor,
            url: this.config.url,
            closeObserver: {
                next: _ => getLogger().log('closeObserver next'),
            },
            closingObserver: {
                next: _ => getLogger().log('closingObserver next'),
            },
            openObserver: {
                next: _ => getLogger().log('openObserver next'),
            },
        });
    }

    private observeResponse<T>(filterPredicate: (res: IOpenviduResponse<T>) => boolean) {
        return this.getSocketObservable().pipe(
            filter(val => isOpenviduResponse(val)),
            map(val => val as IOpenviduResponse<T>),
            filter(filterPredicate),
            tap(resp => getLogger().log('received response: ', JSON.stringify(resp))),
        );
    }

    private getSocketObservable() {
        return this.socket.asObservable().pipe(
            repeatWhen(notification => {
                return notification.pipe(tap(_ => getLogger().log('Socket complete. Restarting...', _)));
            }),
            retryWhen(this.configureRetryOnCloseEvent()),
        );
    }

    private getRequestId() {
        let nextId = this.idGenerator.next();
        if (nextId.done) {
            this.idGenerator = this.createIdGenerator();
            nextId = this.idGenerator.next();
        }
        return nextId.value;
    }

    private createIdGenerator() {
        return this.range(1, Number.MAX_SAFE_INTEGER);
    }

    private *range(start: number, count: number, step: number = 1) {
        let counter = start;
        while (counter < count) {
            yield counter;
            counter = counter + step;
        }
    }
}
