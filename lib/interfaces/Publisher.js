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
var PublishVideoRequest_1 = require("../rpc-methods/requests/PublishVideoRequest");
var StreamBuilder_1 = require("./StreamBuilder");
var operators_1 = require("rxjs/operators");
var Publisher = /** @class */ (function (_super) {
    __extends(Publisher, _super);
    function Publisher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Publisher.prototype.publish = function (properties) {
        if (!this.session) {
            return rxjs_1.throwError(new Error('Trying to publish from undefined Session'));
        }
        var session = this.session;
        this.properties = properties;
        return this.setupWebrtc({
            rtcConfig: {
                iceServers: session.builder.config.tokenMeta.iceServers,
            },
            webrtcBuilder: session.builder.config.openviduConfig.webrtcBuilder,
        }).pipe(operators_1.mapTo(this));
    };
    Publisher.prototype.setupWebrtc = function (webrtcConfig) {
        var _this = this;
        var properties = this.properties;
        var session = this.session;
        return _super.prototype.setupWebrtc.call(this, webrtcConfig, function (sdp) {
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
                _this.streams = !_this.streams ? [] : _this.streams;
                var stream = new StreamBuilder_1.StreamBuilder().build();
                stream.streamId = res.id;
                _this.streams.push(stream);
                return res.sdpAnswer;
            }));
        });
    };
    return Publisher;
}(Connection_1.Connection));
exports.Publisher = Publisher;
//# sourceMappingURL=Publisher.js.map