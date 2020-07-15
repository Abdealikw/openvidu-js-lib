import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
import { RPCMethod } from '../base/methods';

export interface IParticipantEvictedNotificationParam {
    connectionId: string;
    reason: string;
}

export class ParticipantEvictedNotification extends RPCNotificationMethod<IParticipantEvictedNotificationParam> {
    constructor() {
        super(RPCMethod.participantEvicted);
    }
}
