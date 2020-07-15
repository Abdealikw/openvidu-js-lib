import { IRPCNotificationMethod, RPCMethod } from '../base/methods';
export declare class RPCNotificationMethod<P> implements IRPCNotificationMethod<P> {
    method: RPCMethod;
    param?: P;
    constructor(method: RPCMethod);
    mapParam(param?: any): P | undefined;
}
//# sourceMappingURL=RPCNotificationMethod.d.ts.map
