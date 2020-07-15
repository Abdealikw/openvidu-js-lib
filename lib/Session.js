"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var JoinRoomRequest_1 = require("./rpc-methods/requests/JoinRoomRequest");
var ParticipantJoinedNotification_1 = require("./rpc-methods/notifications/ParticipantJoinedNotification");
var ParticipantPublishedNotification_1 = require("./rpc-methods/notifications/ParticipantPublishedNotification");
var PingRequest_1 = require("./rpc-methods/requests/PingRequest");
var LeaveRoomRequest_1 = require("./rpc-methods/requests/LeaveRoomRequest");
var ParticipantLeftNotification_1 = require("./rpc-methods/notifications/ParticipantLeftNotification");
var ParticipantUnpublishedNotification_1 = require("./rpc-methods/notifications/ParticipantUnpublishedNotification");
var Logger_1 = require("./Logger");
var utils_1 = require("./rpc/utils");
var Session = /** @class */ (function () {
    function Session(builder) {
        this.builder = builder;
        this.subscriberMap = new Map();
        this.leavingSessionSubject = new rxjs_1.Subject();
        this.onPublishSubject = new rxjs_1.Subject();
        this.onUnPublishSubject = new rxjs_1.Subject();
        this.onJoinSubject = new rxjs_1.Subject();
        this.onLeftSubject = new rxjs_1.Subject();
        this.socketManager = this.builder.config.socketManager;
    }
    Session.prototype.onLeavingSession = function () {
        return this.leavingSessionSubject.asObservable();
    };
    Session.prototype.onParticipantJoin = function () {
        return this.onJoinSubject.asObservable();
    };
    Session.prototype.onPublish = function () {
        return this.onPublishSubject.asObservable();
    };
    Session.prototype.onLeft = function () {
        return this.onLeftSubject.asObservable();
    };
    Session.prototype.onParticipantUnPublish = function () {
        return this.onUnPublishSubject.asObservable();
    };
    Session.prototype.join = function () {
        var _this = this;
        return new rxjs_1.Observable(function (sub) {
            var nextError = {
                error: function (err) { return sub.error(err); },
            };
            var subscriptions = _this.sendPing().subscribe(nextError);
            subscriptions.add(_this.onParticipantJoined().subscribe(nextError));
            subscriptions.add(_this.onParticipantPublished().subscribe(nextError));
            subscriptions.add(_this.onParticipantLeft().subscribe(nextError));
            subscriptions.add(_this.onParticipantUnpublished().subscribe(nextError));
            subscriptions.add(_this.joinRoom().subscribe(function (msg) { return sub.next(msg); }, function (err) { return sub.error(err); }));
            return function () {
                Logger_1.getLogger().log('Unsubscribing.. Join');
                _this.leavingSessionSubject.next();
                subscriptions.add(_this.leaveRoom()
                    .pipe(operators_1.finalize(function () { return subscriptions.unsubscribe(); }), operators_1.catchError(function (err) {
                    Logger_1.getLogger().log('Leaving Room Error', err);
                    return rxjs_1.of(err);
                }))
                    .subscribe());
            };
        });
    };
    Session.prototype.leaveRoom = function () {
        return this.socketManager.sendRequestAndObserveOne(new LeaveRoomRequest_1.LeaveRoomRequest());
    };
    Session.prototype.joinRoom = function () {
        var _this = this;
        var tokenMeta = this.builder.config.tokenMeta;
        var openviduConfig = this.builder.config.openviduConfig;
        var joinRoomRequest = new JoinRoomRequest_1.JoinRoomRequest({
            metadata: !tokenMeta.metadata ? '' : JSON.stringify(tokenMeta.metadata),
            platform: openviduConfig.platform,
            token: tokenMeta.tokenUrl,
            secret: tokenMeta.secret,
            session: tokenMeta.sessionId,
            recorder: tokenMeta.recorder,
        });
        return this.socketManager.sendRequestAndObserveOne(joinRoomRequest).pipe(operators_1.map(function (res) { return _this.builder.fromJoinRoomResponseParam(res, _this); }), operators_1.mergeMap(function (sess) {
            if (sess.subscriberMap.size > 0) {
                var participantJoined = rxjs_1.from(sess.subscriberMap.values()).pipe(operators_1.filter(function (sub) { return sub.streams !== undefined && sub.streams.length > 0; }), operators_1.tap(function (sub) { return _this.onPublishSubject.next(sub); }));
                return rxjs_1.from(participantJoined.toPromise().then(function (_) { return sess; }));
            }
            return rxjs_1.of(sess);
        }));
    };
    Session.prototype.onParticipantUnpublished = function () {
        var _this = this;
        var notificationObservable = this.socketManager.observeNotification(new ParticipantUnpublishedNotification_1.ParticipantUnpublishedNotification());
        var subscriberPipeline = notificationObservable.pipe(operators_1.map(function (param) { return _this.subscriberMap.get(param.connectionId); }), operators_1.filter(function (sub) { return sub !== undefined; }), operators_1.tap(function (sub) { return _this.onUnPublishSubject.next(sub); }), operators_1.tap(function (sub) { return sub.streams.shift(); }), operators_1.mapTo(undefined));
        var publisherPipeline = notificationObservable.pipe(operators_1.filter(function (param) { return _this.publisher.connectionId === param.connectionId; }), operators_1.tap(function () { return _this.publisher.forceUnpublished$.next(); }), operators_1.mapTo(undefined));
        return rxjs_1.merge(subscriberPipeline, publisherPipeline);
    };
    Session.prototype.onParticipantLeft = function () {
        var _this = this;
        return this.socketManager.observeNotification(new ParticipantLeftNotification_1.ParticipantLeftNotification()).pipe(operators_1.map(function (param) { return _this.subscriberMap.get(param.connectionId); }), operators_1.filter(function (sub) { return sub !== undefined; }), operators_1.tap(function (sub) { return _this.onLeftSubject.next(sub); }), operators_1.tap(function (sub) { return _this.subscriberMap.delete(sub.connectionId); }));
    };
    Session.prototype.onParticipantJoined = function () {
        var _this = this;
        return this.socketManager.observeNotification(new ParticipantJoinedNotification_1.ParticipantJoinedNotification()).pipe(operators_1.map(function (opt) { return _this.addSubscriberConnection(opt); }), operators_1.tap(function (sub) { return _this.onJoinSubject.next(sub); }));
    };
    Session.prototype.onParticipantPublished = function () {
        var _this = this;
        return this.socketManager.observeNotification(new ParticipantPublishedNotification_1.ParticipantPublishedNotification()).pipe(operators_1.map(function (opt) { return _this.updateSubscriberStreams(opt); }), operators_1.filter(function (sub) { return sub !== undefined; }), operators_1.map(function (sub) { return sub; }), operators_1.tap(function (subscriber) { return _this.onPublishSubject.next(subscriber); }));
    };
    Session.prototype.sendPing = function () {
        var _this = this;
        var pingRequest = new PingRequest_1.PingRequest({
            interval: this.builder.config.pingInterval,
        });
        return this.socketManager.sendRequestAndObserveOne(pingRequest).pipe(operators_1.retryWhen(utils_1.configureRetryOnTimeout()), operators_1.switchMap(function () {
            var interval = _this.builder.config.pingInterval;
            return rxjs_1.timer(interval).pipe(operators_1.tap(function () { return Logger_1.getLogger().log('Requesting...'); }), operators_1.switchMap(function () { return _this.sendPing(); }));
        }));
    };
    Session.prototype.addSubscriberConnection = function (opt) {
        var connection = this.subscriberMap.get(opt.id);
        var subscriber = this.builder.config.subscriberBuilder.fromConnectionOptions(opt, this, connection);
        this.subscriberMap.set(opt.id, subscriber);
        return subscriber;
    };
    Session.prototype.updateSubscriberStreams = function (param) {
        var connection = this.subscriberMap.get(param.id);
        if (!connection) {
            return;
        }
        var streamBuilder = this.builder.config.subscriberBuilder.connectionConfig.streamBuilder;
        connection.streams = param.streams.map(function (streamOpt) {
            return streamBuilder.fromStreamOptionsServer(streamOpt, connection);
        });
        return connection;
    };
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=Session.js.map