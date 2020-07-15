import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
import { RPCMethod } from '../base/methods';

interface IParticipantUnpublishedNotificationParam {
    connectionId: string;
    reason: string;
}

export class ParticipantUnpublishedNotification extends RPCNotificationMethod<
    IParticipantUnpublishedNotificationParam
> {
    constructor() {
        super(RPCMethod.participantUnpublished);
    }
}
