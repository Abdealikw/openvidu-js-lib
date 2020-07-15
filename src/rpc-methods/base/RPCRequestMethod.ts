import { IRPCRequestMethod, RPCMethod } from './methods';
import { RPCNotificationMethod } from '../base/RPCNotificationMethod';

export class RPCRequestMethod<P, R> extends RPCNotificationMethod<P> implements IRPCRequestMethod<P, R> {
    public result?: R;
    constructor(method: RPCMethod) {
        super(method);
    }
    public mapResult(result?: any): R | undefined {
        if (!result) {
            return result;
        }
        const transformedResult = result as R;
        this.result = transformedResult;
        return transformedResult;
    }
}
