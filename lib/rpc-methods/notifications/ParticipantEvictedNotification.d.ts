import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
export interface IParticipantEvictedNotificationParam {
    connectionId: string;
    reason: string;
}
export declare class ParticipantEvictedNotification extends RPCNotificationMethod<
    IParticipantEvictedNotificationParam
> {
    constructor();
}
//# sourceMappingURL=ParticipantEvictedNotification.d.ts.map
