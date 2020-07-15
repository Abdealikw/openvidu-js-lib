"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Webrtc_1 = require("./Webrtc");
var operators_1 = require("rxjs/operators");
var OnIceCandidateRequest_1 = require("./rpc-methods/requests/OnIceCandidateRequest");
var IceCandidateNotification_1 = require("./rpc-methods/notifications/IceCandidateNotification");
var Connection = /** @class */ (function () {
    function Connection() {
        this.connectionId = '';
        this.privateData = '';
    }
    Object.defineProperty(Connection.prototype, "data", {
        get: function () {
            return this.privateData;
        },
        set: function (val) {
            this.privateData = val;
            var splittedData = val.split('%');
            if (splittedData[0]) {
                this.clientMetadata = JSON.parse(splittedData[0]);
            }
            if (splittedData[1]) {
                this.serverMetadata = JSON.parse(splittedData[1]);
            }
        },
        enumerable: true,
        configurable: true
    });
    Connection.prototype.sendIceCandidatesToRemote = function (iceCandidate) {
        var session = this.session;
        var onIceCandidateRequest = new OnIceCandidateRequest_1.OnIceCandidateRequest({
            candidate: iceCandidate.candidate,
            endpointName: this.connectionId,
            sdpMLineIndex: iceCandidate.sdpMLineIndex,
            sdpMid: iceCandidate.sdpMid,
        });
        return session.socketManager.sendRequestAndObserveOne(onIceCandidateRequest);
    };
    Connection.prototype.receiveIceCandidateFromRemote = function () {
        var _this = this;
        var session = this.session;
        return session.socketManager.observeNotification(new IceCandidateNotification_1.IceCandidateNotification()).pipe(operators_1.filter(function (param) { return param !== undefined && param.endpointName === _this.connectionId; }), operators_1.map(function (param) { return param; }), operators_1.map(function (param) {
            var iceCandidate = {
                candidate: param.candidate,
                component: param.component,
                foundation: param.foundation,
                ip: param.ip,
                port: param.port,
                priority: param.priority,
                protocol: param.protocol,
                relatedAddress: param.relatedAddress,
                relatedPort: param.relatedPort,
                sdpMid: param.sdpMid,
                sdpMLineIndex: param.sdpMLineIndex,
                tcpType: param.tcpType,
                usernameFragment: param.usernameFragment,
                type: param.type,
                toJSON: function () {
                    var candidateInit = {
                        candidate: param.candidate,
                        sdpMLineIndex: param.sdpMLineIndex,
                        sdpMid: param.sdpMid,
                        usernameFragment: param.usernameFragment ? param.usernameFragment : undefined,
                    };
                    return candidateInit;
                },
            };
            return iceCandidate;
        }));
    };
    Connection.prototype.setupWebrtc = function (sendSDPToRemoteAndGetAnswer, webrtcDispose, beforeOffer) {
        var _this = this;
        var session = this.session;
        this.webrtc = new Webrtc_1.Webrtc({
            rtcConfig: {
                iceServers: session.builder.config.tokenMeta.iceServers,
            },
            webrtcBuilder: session.builder.config.openviduConfig.webrtcBuilder,
        });
        return this.webrtc.setupWebrtcConnection(function (ice) { return _this.sendIceCandidatesToRemote(ice).pipe(operators_1.mapTo(undefined)); }, function () { return _this.receiveIceCandidateFromRemote(); }, sendSDPToRemoteAndGetAnswer, webrtcDispose, beforeOffer);
    };
    return Connection;
}());
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map