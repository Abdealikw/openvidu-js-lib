import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

interface IUnsubscribeFromVideoRequestParam {
    sender: string;
}

export class UnsubscribeFromVideoRequest extends RPCRequestMethod<IUnsubscribeFromVideoRequestParam, any> {
    constructor(public param: IUnsubscribeFromVideoRequestParam) {
        super(RPCMethod.unsubscribeFromVideo);
    }
}
