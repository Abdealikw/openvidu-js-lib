import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
import { RPCMethod } from '../base/methods';
import { IStreamOptionsServer } from '../../interfaces/StreamOptionsServer';

export interface IParticipantPublishedNotificationParam {
    id: string;
    streams: IStreamOptionsServer[];
}

export class ParticipantPublishedNotification extends RPCNotificationMethod<IParticipantPublishedNotificationParam> {
    constructor() {
        super(RPCMethod.participantPublished);
    }
}
