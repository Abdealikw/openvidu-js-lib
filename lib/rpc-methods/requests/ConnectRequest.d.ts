import { RPCRequestMethod } from '../base/RPCRequestMethod';
export interface IConnectRequestParam {
    sessionId: string;
}
export declare class ConnectRequest extends RPCRequestMethod<IConnectRequestParam, any> {
    param: IConnectRequestParam;
    constructor(param: IConnectRequestParam);
}
//# sourceMappingURL=ConnectRequest.d.ts.map
