import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

export interface IConnectRequestParam {
    sessionId: string;
}

export class ConnectRequest extends RPCRequestMethod<IConnectRequestParam, any> {
    constructor(public param: IConnectRequestParam) {
        super(RPCMethod.connect);
    }
}
