import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
import { IStreamOptionsServer } from '../../interfaces/StreamOptionsServer';
export interface IParticipantPublishedNotificationParam {
    id: string;
    streams: IStreamOptionsServer[];
}
export declare class ParticipantPublishedNotification extends RPCNotificationMethod<
    IParticipantPublishedNotificationParam
> {
    constructor();
}
//# sourceMappingURL=ParticipantPublishedNotification.d.ts.map
