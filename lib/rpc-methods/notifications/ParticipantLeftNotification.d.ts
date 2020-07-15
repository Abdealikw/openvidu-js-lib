import { RPCNotificationMethod } from '../base/RPCNotificationMethod';
export interface IParticipantLeftNotificationParam {
    connectionId: string;
    reason: string;
}
export declare class ParticipantLeftNotification extends RPCNotificationMethod<IParticipantLeftNotificationParam> {
    constructor();
}
//# sourceMappingURL=ParticipantLeftNotification.d.ts.map
