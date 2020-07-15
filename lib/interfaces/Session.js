"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var JoinRoomRequest_1 = require("../rpc-methods/requests/JoinRoomRequest");
var ParticipantJoinedNotification_1 = require("../rpc-methods/notifications/ParticipantJoinedNotification");
var ParticipantPublishedNotification_1 = require("../rpc-methods/notifications/ParticipantPublishedNotification");
var IceCandidateNotification_1 = require("../rpc-methods/notifications/IceCandidateNotification");
var PingRequest_1 = require("../rpc-methods/requests/PingRequest");
var ConnectRequest_1 = require("../rpc-methods/requests/ConnectRequest");
var LeaveRoomRequest_1 = require("../rpc-methods/requests/LeaveRoomRequest");
var Session = /** @class */ (function () {
    function Session(builder) {
        this.builder = builder;
        this.subscriberMap = new Map();
        this.socketManager = this.builder.config.socketManager;
        this.onPublishSubject = new rxjs_1.Subject();
    }
    Session.prototype.onPublish = function () {
        return this.onPublishSubject.asObservable();
    };
    Session.prototype.join = function () {
        var _this = this;
        return new rxjs_1.Observable(function (sub) {
            var subscriptions = _this.setupListeners();
            subscriptions.add(_this.joinRoom().subscribe({ next: sub.next, error: sub.error }));
            return function () {
                subscriptions.add(_this.leaveRoom().subscribe(function (_) {
                    subscriptions.unsubscribe();
                }));
            };
        });
    };
    Session.prototype.setupListeners = function () {
        var subscription = this.setupPing().subscribe();
        subscription.add(this.onParticipantJoined().subscribe());
        subscription.add(this.onParticipantPublished().subscribe());
        subscription.add(this.onIceCandidateReceive().subscribe());
        return subscription;
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
                var participantJoined = rxjs_1.from(sess.subscriberMap.values()).pipe(operators_1.tap(function (sub) { return _this.onPublishSubject.next(sub); }));
                return rxjs_1.from(participantJoined.toPromise().then(function (_) { return sess; }));
            }
            return rxjs_1.of(sess);
        }));
    };
    Session.prototype.reconnect = function () {
        var connectRequest = new ConnectRequest_1.ConnectRequest({
            sessionId: this.rpcSessionId
        });
        return this.socketManager.sendRequestAndObserveOne(connectRequest).pipe(operators_1.mapTo(this));
    };
    Session.prototype.onParticipantJoined = function () {
        var _this = this;
        return this.socketManager
            .observeNotification(new ParticipantJoinedNotification_1.ParticipantJoinedNotification())
            .pipe(operators_1.map(function (opt) { return _this.addOrUpdateSubscriberConnection(opt); }));
    };
    Session.prototype.onParticipantPublished = function () {
        var _this = this;
        return this.socketManager.observeNotification(new ParticipantPublishedNotification_1.ParticipantPublishedNotification()).pipe(operators_1.map(function (opt) { return _this.addOrUpdateSubscriberConnection(opt); }), operators_1.tap(function (subscriber) { return _this.onPublishSubject.next(subscriber); }));
    };
    Session.prototype.onIceCandidateReceive = function () {
        var _this = this;
        return this.socketManager.observeNotification(new IceCandidateNotification_1.IceCandidateNotification()).pipe(operators_1.mergeMap(function (param) {
            if (!param) {
                throw new Error('Expected RTCIceCandidateParam');
            }
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
            var connection = _this.getConnectionForId(param.endpointName);
            if (!connection || !connection.webrtc) {
                return rxjs_1.of(rxjs_1.noop());
            }
            var connectionWebrtc = connection.webrtc;
            return connectionWebrtc
                .onStableSignalingState()
                .pipe(operators_1.mergeMap(function (_) { return rxjs_1.from(connectionWebrtc.addIceCandidate(iceCandidate)); }));
        }));
    };
    Session.prototype.getConnectionForId = function (connectionId) {
        var connection;
        if (this.publisher && this.publisher.connectionId === connectionId) {
            connection = this.publisher;
        }
        else {
            connection = this.subscriberMap.get(connectionId);
        }
        return connection;
    };
    Session.prototype.setupPing = function () {
        var _this = this;
        var pingRequest = new PingRequest_1.PingRequest({
            interval: this.builder.config.pingInterval,
        });
        var sendPing = function () {
            _this.socketManager.sendRequest(pingRequest);
        };
        sendPing();
        return this.socketManager
            .observeResponseResult(pingRequest, function (res) { return res.value === 'pong'; })
            .pipe(operators_1.switchMap(function (_) { return rxjs_1.timer(_this.builder.config.pingInterval); }), operators_1.tap(function (_) { return sendPing(); }));
    };
    Session.prototype.addOrUpdateSubscriberConnection = function (opt) {
        var connection = this.subscriberMap.get(opt.id);
        var subscriber = this.builder.config.subscriberBuilder.fromConnectionOptions(opt, connection);
        subscriber.session = this;
        this.subscriberMap.set(opt.id, subscriber);
        return subscriber;
    };
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=Session.js.map