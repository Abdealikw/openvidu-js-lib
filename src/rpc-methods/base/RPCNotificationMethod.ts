import { IRPCNotificationMethod, RPCMethod } from '../base/methods';

export class RPCNotificationMethod<P> implements IRPCNotificationMethod<P> {
    public param?: P;
    constructor(public method: RPCMethod) {}
    public mapParam(param?: any): P | undefined {
        if (!param) {
            return undefined;
        }
        const transformedParam = param as P;
        this.param = transformedParam;
        return this.param;
    }
}
