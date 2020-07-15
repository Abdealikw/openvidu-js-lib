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
var rxjs_1 = require("rxjs");
var ReceiveVideoFromRequest_1 = require("./rpc-methods/requests/ReceiveVideoFromRequest");
var UnsubscribeFromVideoRequest_1 = require("./rpc-methods/requests/UnsubscribeFromVideoRequest");
var Logger_1 = require("./Logger");
var Subscriber = /** @class */ (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Subscriber.prototype.subscribeToStream = function (properties) {
        var _this = this;
        var respondToSdp = this.createRespondToSdp(properties);
        return this.setupWebrtc(respondToSdp, properties.webrtcDispose).pipe(operators_1.takeUntil(rxjs_1.merge(this.session.onParticipantUnPublish().pipe(operators_1.filter(function (sub) { return sub.connectionId === _this.connectionId; })), this.session.onLeft().pipe(operators_1.filter(function (sub) { return sub.connectionId === _this.connectionId; })), this.session.onLeavingSession())), operators_1.finalize(function () {
            var session = _this.session;
            var unsubscriberFromVideoRequest = new UnsubscribeFromVideoRequest_1.UnsubscribeFromVideoRequest({
                sender: _this.connectionId,
            });
            session.socketManager
                .sendRequestAndObserveOne(unsubscriberFromVideoRequest)
                .toPromise()
                .catch(Logger_1.getLogger().log);
        }), operators_1.mapTo(this));
    };
    Subscriber.prototype.createRespondToSdp = function (properties) {
        var _this = this;
        return function (sdp) {
            var session = _this.session;
            var receiveVideoFromRequest = new ReceiveVideoFromRequest_1.ReceiveVideoFromRequest({
                sdpOffer: sdp,
                sender: _this.streams[0].streamId,
            });
            return session.socketManager
                .sendRequestAndObserveOne(receiveVideoFromRequest)
                .pipe(operators_1.map(function (res) { return res.sdpAnswer; }));
        };
    };
    return Subscriber;
}(Connection_1.Connection));
exports.Subscriber = Subscriber;
//# sourceMappingURL=Subscriber.js.map