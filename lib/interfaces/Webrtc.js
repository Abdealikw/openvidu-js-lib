"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Webrtc = /** @class */ (function () {
    function Webrtc(config) {
        if (!config.webrtcBuilder.rtcPeerCtor) {
            throw new Error('Need RTCPeerConnection Constructor');
        }
        this.peerConnection = new config.webrtcBuilder.rtcPeerCtor(config.rtcConfig);
        this.onSignalingStateChange().pipe(operators_1.tap(function (state) { return console.log('Signalling State Change: ', state); })).subscribe();
        this.onIceConnectionStateChange().pipe(operators_1.tap(function (state) { return console.log('Ice connection state change: ', state); })).subscribe();
    }
    Webrtc.prototype.onIceCandidate = function () {
        return rxjs_1.fromEvent(this.peerConnection, 'icecandidate').pipe(operators_1.takeWhile(function (e) { return e.candidate !== null; }), operators_1.map(function (e) { return e.candidate; }));
    };
    Webrtc.prototype.onIceConnectionStateChange = function () {
        var _this = this;
        return rxjs_1.fromEvent(this.peerConnection, 'iceconnectionstatechange').pipe(operators_1.map(function (_) { return _this.peerConnection.iceConnectionState; }));
    };
    Webrtc.prototype.onSignalingStateChange = function () {
        var _this = this;
        return rxjs_1.fromEvent(this.peerConnection, 'signalingstatechange').pipe(operators_1.map(function (_) { return _this.peerConnection.signalingState; }));
    };
    Webrtc.prototype.onStableSignalingState = function () {
        var _this = this;
        if (this.isStableSignalingState(this.peerConnection.signalingState)) {
            return rxjs_1.of(this.peerConnection.signalingState);
        }
        return this.onSignalingStateChange().pipe(operators_1.filter(function (state) { return _this.isStableSignalingState(state); }));
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
    Webrtc.prototype.isStableSignalingState = function (signallingState) {
        return signallingState === 'stable';
    };
    return Webrtc;
}());
exports.Webrtc = Webrtc;
//# sourceMappingURL=Webrtc.js.map