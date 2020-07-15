"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stream = /** @class */ (function () {
    function Stream() {
        this.streamId = '';
        this.createdAt = -1;
        this.hasAudio = false;
        this.hasVideo = false;
        this.audioActive = false;
        this.videoActive = false;
        this.typeOfVideo = '';
        this.frameRate = -1;
    }
    return Stream;
}());
exports.Stream = Stream;
//# sourceMappingURL=Stream.js.map