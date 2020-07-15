"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Session_1 = require("./Session");
var SessionBuilder = /** @class */ (function () {
    function SessionBuilder(config) {
        this.config = config;
    }
    SessionBuilder.prototype.build = function () {
        return new Session_1.Session(this);
    };
    SessionBuilder.prototype.fromJoinRoomResponseParam = function (opt, sessionObj) {
        var _this = this;
        var session = !sessionObj ? this.build() : sessionObj;
        session.rpcSessionId = opt.sessionId;
        session.publisher = this.config.publisherBuilder.fromConnectionOptions({
            id: opt.id,
            metadata: opt.metadata,
        });
        session.publisher.session = session;
        session.subscriberMap = opt.value.reduce(function (prev, curr) {
            var subscriber = _this.config.subscriberBuilder.fromConnectionOptions(curr);
            subscriber.session = session;
            prev.set(curr.id, subscriber);
            return prev;
        }, session.subscriberMap);
        return session;
    };
    return SessionBuilder;
}());
exports.SessionBuilder = SessionBuilder;
//# sourceMappingURL=SessionBuilder.js.map