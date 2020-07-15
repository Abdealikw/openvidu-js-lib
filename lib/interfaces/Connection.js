"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Webrtc_1 = require("./Webrtc");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var OnIceCandidateRequest_1 = require("../rpc-methods/requests/OnIceCandidateRequest");
var Connection = /** @class */ (function () {
    function Connection() {
        this.connectionId = '';
        this.data = '';
    }
    Connection.prototype.sendIceCandidatesToServer = function (connectionId, iceCandidate) {
        var session = this.session;
        var onIceCandidateRequest = new OnIceCandidateRequest_1.OnIceCandidateRequest({
            candidate: iceCandidate.candidate,
            endpointName: connectionId,
            sdpMLineIndex: iceCandidate.sdpMLineIndex,
            sdpMid: iceCandidate.sdpMid,
        });
        return session.socketManager.sendRequestAndObserveOne(onIceCandidateRequest);
    };
    Connection.prototype.setupWebrtc = function (webrtcConfig, sendSDPToServerAndGetAnswer) {
        var _this = this;
        var webrtc = new Webrtc_1.Webrtc(webrtcConfig);
        this.webrtc = webrtc;
        var iceCandidateRelay = webrtc.onIceCandidate().pipe(operators_1.mergeMap(function (iceCandidate) {
            return webrtc
                .onStableSignalingState()
                .pipe(operators_1.mergeMap(function (_) { return _this.sendIceCandidatesToServer(_this.connectionId, iceCandidate); }));
        }));
        var webrtcSetupPromise = webrtc.generateOffer()
            .then(function (sdp) { return sendSDPToServerAndGetAnswer(sdp).toPromise(); })
            .then(function (sdpAnswer) { return webrtc.processAnswer(sdpAnswer); });
        return rxjs_1.from(webrtcSetupPromise).pipe(operators_1.mergeMap(function (_) { return rxjs_1.from(iceCandidateRelay.toPromise()); }));
    };
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map