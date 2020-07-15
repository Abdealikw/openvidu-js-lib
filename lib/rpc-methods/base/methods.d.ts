export declare enum RPCMethod {
    onIceCandidate = 'onIceCandidate',
    streamPropertyChanged = 'streamPropertyChanged',
    connect = 'connect',
    unsubscribeFromVideo = 'unsubscribeFromVideo',
    unpublishVideo = 'unpublishVideo',
    forceDisconnect = 'forceDisconnect',
    forceUnpublish = 'forceUnpublish',
    sendMessage = 'sendMessage',
    leaveRoom = 'leaveRoom',
    joinRoom = 'joinRoom',
    publishVideo = 'publishVideo',
    receiveVideoFrom = 'receiveVideoFrom',
    ping = 'ping',
    participantJoined = 'participantJoined',
    participantPublished = 'participantPublished',
    participantUnpublished = 'participantUnpublished',
    participantLeft = 'participantLeft',
    participantEvicted = 'participantEvicted',
    iceCandidate = 'iceCandidate',
    mediaError = 'mediaError',
}
export interface IRPCNotificationMethod<P> {
    method: RPCMethod;
    param?: P;
    mapParam(param?: any): P | undefined;
}
export interface IRPCRequestMethod<P, R> extends IRPCNotificationMethod<P> {
    result?: R;
    mapResult(result?: any): R | undefined;
}
//# sourceMappingURL=methods.d.ts.map
