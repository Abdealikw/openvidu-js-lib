import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
import { RPCMethod } from '../base/methods';

export interface IParticipantLeftNotificationParam {
    connectionId: string;
    reason: string;
}

export class ParticipantLeftNotification extends RPCNotificationMethod<IParticipantLeftNotificationParam> {
    constructor() {
        super(RPCMethod.participantLeft);
    }
}
