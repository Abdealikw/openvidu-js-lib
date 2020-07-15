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
var rxjs_1 = require("rxjs");
var PublishVideoRequest_1 = require("./rpc-methods/requests/PublishVideoRequest");
var operators_1 = require("rxjs/operators");
var UnpublishVideoRequest_1 = require("./rpc-methods/requests/UnpublishVideoRequest");
var Logger_1 = require("./Logger");
var Publisher = /** @class */ (function (_super) {
    __extends(Publisher, _super);
    function Publisher() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.forceUnpublished$ = new rxjs_1.Subject();
        return _this;
    }
    Publisher.prototype.publish = function (properties) {
        var _this = this;
        var respondToSdp = this.createRespondToSdp(properties);
        return this.setupWebrtc(respondToSdp, properties.webrtcDispose, properties.webrtcAddStream).pipe(operators_1.takeUntil(rxjs_1.merge(this.forceUnpublished$.asObservable(), this.session.onLeavingSession())), operators_1.finalize(function () {
            var session = _this.session;
            session.socketManager
                .sendRequestAndObserveOne(new UnpublishVideoRequest_1.UnpublishVideoRequest())
                .toPromise()
                .finally(function () {
                _this.streams.shift();
            })
                .catch(Logger_1.getLogger().log);
        }), operators_1.mapTo(this));
    };
    Publisher.prototype.createRespondToSdp = function (properties) {
        var _this = this;
        return function (sdp) {
            var session = _this.session;
            var publishVideoRequest = new PublishVideoRequest_1.PublishVideoRequest({
                sdpOffer: sdp,
                typeOfVideo: properties.typeOfVideo,
                doLoopback: properties.doLoopback,
                hasAudio: properties.hasAudio,
                hasVideo: properties.hasVideo,
                audioActive: properties.audioActive,
                videoActive: properties.videoActive,
                videoDimensions: JSON.stringify(properties.videoDimensions),
                frameRate: properties.frameRate,
            });
            return session.socketManager.sendRequestAndObserveOne(publishVideoRequest).pipe(operators_1.map(function (res) {
                var streamBuilder = session.builder.config.publisherBuilder.connectionConfig.streamBuilder;
                _this.streams = !_this.streams ? [] : _this.streams;
                var stream = streamBuilder.fromPublisherOptions(res.id, properties, _this);
                _this.streams.push(stream);
                return res.sdpAnswer;
            }));
        };
    };
    return Publisher;
}(Connection_1.Connection));
exports.Publisher = Publisher;
//# sourceMappingURL=Publisher.js.map