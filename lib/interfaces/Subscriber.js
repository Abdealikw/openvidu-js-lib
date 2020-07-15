"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Connection_1 = require("./Connection");
var operators_1 = require("rxjs/operators");
var ReceiveVideoFromRequest_1 = require("../rpc-methods/requests/ReceiveVideoFromRequest");
var Subscriber = /** @class */ (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Subscriber.prototype.subscribeToStream = function () {
        var session = this.session;
        return this.setupWebrtc({
            rtcConfig: {
                iceServers: session.builder.config.tokenMeta.iceServers,
            },
            webrtcBuilder: session.builder.config.openviduConfig.webrtcBuilder,
        }).pipe(operators_1.mapTo(this));
    };
    Subscriber.prototype.setupWebrtc = function (webrtcConfig) {
        var _this = this;
        var session = this.session;
        return _super.prototype.setupWebrtc.call(this, webrtcConfig, function (sdp) {
            var receiveVideoFromRequest = new ReceiveVideoFromRequest_1.ReceiveVideoFromRequest({
                sdpOffer: sdp,
                sender: _this.streams[0].streamId,
            });
            return session.socketManager.sendRequestAndObserveOne(receiveVideoFromRequest).pipe(operators_1.map(function (res) { return res.sdpAnswer; }));
        });
    };
    return Subscriber;
}(Connection_1.Connection));
exports.Subscriber = Subscriber;
//# sourceMappingURL=Subscriber.js.map