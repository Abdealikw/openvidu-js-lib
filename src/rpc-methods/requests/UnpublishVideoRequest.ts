import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

export class UnpublishVideoRequest extends RPCRequestMethod<undefined, any> {
    constructor() {
        super(RPCMethod.unpublishVideo);
    }
}
