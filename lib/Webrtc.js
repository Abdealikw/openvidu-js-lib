"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Logger_1 = require("./Logger");
var Webrtc = /** @class */ (function () {
    function Webrtc(config) {
        this.peerConnection = new config.webrtcBuilder.rtcPeerCtor(config.rtcConfig);
        this.onSignalingStateChange()
            .pipe(operators_1.tap(function (state) { return Logger_1.getLogger().log('Signalling State Change: ', state); }))
            .subscribe();
        this.onIceConnectionStateChange()
            .pipe(operators_1.tap(function (state) { return Logger_1.getLogger().log('Ice connection state change: ', state); }))
            .subscribe();
    }
    Webrtc.prototype.setupWebrtcConnection = function (sendIceCandidatesToRemote, receiveIceCandidatesFromRemote, sendOfferToRemoteAndGetAnswer, webrtcDispose, beforeOffer) {
        var _this = this;
        return new rxjs_1.Observable(function (sub) {
            if (beforeOffer) {
                beforeOffer(_this.peerConnection);
            }
            var receiveIceCandidatesFromRemote$ = receiveIceCandidatesFromRemote();
            var receiveIceCandidatesFromRemoteSubscription = receiveIceCandidatesFromRemote$
                .pipe(operators_1.mergeMap(function (iceCandidate) {
                return _this.onSignalingStateChange(function (state) { return state === 'stable'; }).pipe(operators_1.mergeMap(function (_) { return rxjs_1.from(_this.addIceCandidate(iceCandidate)); }));
            }))
                .subscribe({
                error: function (err) { return sub.error(err); },
            });
            var iceCandidateRelaySubscription = _this.onIceCandidate()
                .pipe(operators_1.mergeMap(function (iceCandidate) {
                return _this.onSignalingStateChange(function (state) { return state === 'stable'; }).pipe(operators_1.mergeMap(function (_) { return sendIceCandidatesToRemote(iceCandidate); }));
            }))
                .subscribe({
                error: function (err) { return sub.error(err); },
            });
            var webrtcSetupPromise = _this.generateOffer()
                .then(function (sdp) { return sendOfferToRemoteAndGetAnswer(sdp).toPromise(); })
                .then(function (sdpAnswer) { return _this.processAnswer(sdpAnswer); });
            var subscription = rxjs_1.from(webrtcSetupPromise).subscribe(function (msg) { return sub.next(msg); }, function (err) { return sub.error(err); });
            return function () {
                Logger_1.getLogger().log('Unsubscribing.. Webrtc');
                subscription.unsubscribe();
                iceCandidateRelaySubscription.unsubscribe();
                receiveIceCandidatesFromRemoteSubscription.unsubscribe();
                webrtcDispose(_this.peerConnection);
                _this.peerConnection.close();
            };
        });
    };
    Webrtc.prototype.onIceCandidate = function () {
        return rxjs_1.fromEvent(this.peerConnection, 'icecandidate').pipe(operators_1.takeWhile(function (e) { return e.candidate !== null; }), operators_1.map(function (e) { return e.candidate; }));
    };
    Webrtc.prototype.onIceConnectionStateChange = function (filterPredicate) {
        var _this = this;
        if (filterPredicate && filterPredicate(this.peerConnection.iceConnectionState)) {
            return rxjs_1.of(this.peerConnection.iceConnectionState);
        }
        return rxjs_1.fromEvent(this.peerConnection, 'iceconnectionstatechange').pipe(operators_1.map(function (_) { return _this.peerConnection.iceConnectionState; }), operators_1.filter(function (state) { return (!filterPredicate ? true : filterPredicate(state)); }));
    };
    Webrtc.prototype.onSignalingStateChange = function (filterPredicate) {
        var _this = this;
        if (filterPredicate && filterPredicate(this.peerConnection.signalingState)) {
            return rxjs_1.of(this.peerConnection.signalingState);
        }
        return rxjs_1.fromEvent(this.peerConnection, 'signalingstatechange').pipe(operators_1.map(function (_) { return _this.peerConnection.signalingState; }), operators_1.filter(function (state) { return (!filterPredicate ? true : filterPredicate(state)); }));
    };
    Webrtc.prototype.generateOffer = function (offerOptions) {
        var _this = this;
        return this.peerConnection
            .createOffer(offerOptions)
            .then(function (res) { return _this.peerConnection.setLocalDescription(res); })
            .then(function (_) { return _this.peerConnection.localDescription.sdp; });
    };
    Webrtc.prototype.processAnswer = function (sdpAnswer) {
        var answer = {
            type: 'answer',
            sdp: sdpAnswer,
        };
        return this.peerConnection.setRemoteDescription(answer);
    };
    Webrtc.prototype.addIceCandidate = function (iceCandidate) {
        return this.peerConnection.addIceCandidate(iceCandidate);
    };
    return Webrtc;
}());
exports.Webrtc = Webrtc;
//# sourceMappingURL=Webrtc.js.map