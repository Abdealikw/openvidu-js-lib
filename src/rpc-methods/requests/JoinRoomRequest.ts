import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';
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

export class JoinRoomRequest extends RPCRequestMethod<IJoinRoomRequestParam, IJoinRoomResponseParam> {
    constructor(public param: IJoinRoomRequestParam) {
        super(RPCMethod.joinRoom);
    }
}
