import { IRPCRequestMethod, RPCMethod } from './methods';
import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
export declare class RPCRequestMethod<P, R> extends RPCNotificationMethod<P> implements IRPCRequestMethod<P, R> {
    result?: R;
    constructor(method: RPCMethod);
    mapResult(result?: any): R | undefined;
}
//# sourceMappingURL=RPCRequestMethod.d.ts.map
