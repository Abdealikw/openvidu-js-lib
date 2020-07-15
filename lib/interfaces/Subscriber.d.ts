import { Connection } from './Connection';
import { IWebrtcConfig } from './Webrtc';
import { Observable } from 'rxjs';
export declare class Subscriber extends Connection {
    subscribeToStream(): Observable<Subscriber>;
    protected setupWebrtc(
        webrtcConfig: IWebrtcConfig,
    ): Observable<import('../rpc-methods/requests/OnIceCandidateRequest').IIceCandidateResponseParam | undefined>;
}
//# sourceMappingURL=Subscriber.d.ts.map
