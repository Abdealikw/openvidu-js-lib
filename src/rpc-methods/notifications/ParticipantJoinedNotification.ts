import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
import { IConnectionOptions } from '../../interfaces/ConnectionOptions';
import { RPCMethod } from '../base/methods';

export class ParticipantJoinedNotification extends RPCNotificationMethod<IConnectionOptions> {
    constructor() {
        super(RPCMethod.participantJoined);
    }
}
