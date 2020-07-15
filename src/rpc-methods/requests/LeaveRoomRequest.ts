import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

export class LeaveRoomRequest extends RPCRequestMethod<void, any> {
    constructor() {
        super(RPCMethod.leaveRoom);
    }
}
