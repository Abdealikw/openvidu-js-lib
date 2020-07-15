"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stream_1 = require("./Stream");
var StreamBuilder = /** @class */ (function () {
    function StreamBuilder() {
    }
    StreamBuilder.prototype.build = function () {
        return new Stream_1.Stream();
    };
    StreamBuilder.prototype.fromStreamOptionsServer = function (opt, connection) {
        var stream = this.build();
        stream.streamId = opt.id;
        stream.audioActive = opt.audioActive;
        stream.createdAt = opt.createdAt;
        stream.frameRate = opt.frameRate;
        stream.hasAudio = opt.hasAudio;
        stream.hasVideo = opt.hasVideo;
        stream.typeOfVideo = opt.typeOfVideo;
        stream.videoActive = opt.videoActive;
        stream.videoDimensions = opt.videoDimensions ? JSON.parse(opt.videoDimensions) : undefined;
        stream.connection = connection;
        return stream;
    };
    StreamBuilder.prototype.fromPublisherOptions = function (id, opt, connection) {
        var stream = this.build();
        stream.streamId = id;
        stream.audioActive = opt.audioActive;
        stream.frameRate = opt.frameRate;
        stream.hasAudio = opt.hasAudio;
        stream.hasVideo = opt.hasVideo;
        stream.typeOfVideo = opt.typeOfVideo;
        stream.videoActive = opt.videoActive;
        stream.videoDimensions = opt.videoDimensions;
        return stream;
    };
    return StreamBuilder;
}());
exports.StreamBuilder = StreamBuilder;
//# sourceMappingURL=StreamBuilder.js.map