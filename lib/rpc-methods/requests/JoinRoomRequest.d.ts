import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { IConnectionOptions } from '../../interfaces/ConnectionOptions';
export interface IJoinRoomRequestParam {
    token: string;
    session: string;
    platform?: string;
    metadata?: string;
    secret?: string;
    recorder?: boolean;
}
export interface IJoinRoomResponseParam {
    id: string;
    createdAt?: number;
    metadata: string;
    sessionId: string;
    value: IConnectionOptions[];
}
export declare class JoinRoomRequest extends RPCRequestMethod<IJoinRoomRequestParam, IJoinRoomResponseParam> {
    param: IJoinRoomRequestParam;
    constructor(param: IJoinRoomRequestParam);
}
//# sourceMappingURL=JoinRoomRequest.d.ts.map
