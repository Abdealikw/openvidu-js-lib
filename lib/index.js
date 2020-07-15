"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_parse_1 = __importDefault(require("url-parse"));
var openvidu_socket_1 = require("./rpc/openvidu-socket");
var PublisherBuilder_1 = require("./PublisherBuilder");
var SubscriberBuilder_1 = require("./SubscriberBuilder");
var StreamBuilder_1 = require("./StreamBuilder");
var SessionBuilder_1 = require("./SessionBuilder");
var InvalidToken_1 = require("./errors/InvalidToken");
var Logger_1 = require("./Logger");
var OpenVidu = /** @class */ (function () {
    function OpenVidu(openviduConfig) {
        this.openviduConfig = openviduConfig;
        if (openviduConfig.logger) {
            Logger_1.setLogger(openviduConfig.logger);
        }
    }
    OpenVidu.prototype.initSession = function (tokenUrl, metadata) {
        this.tokenMeta = this.parseTokenUrl(tokenUrl);
        this.tokenMeta.metadata = metadata;
        this.socketManager = new openvidu_socket_1.OpenviduSocketManager({
            url: this.tokenMeta.wsUri,
            websocketCtor: this.openviduConfig.websocketBuilder.websocketCtor,
            requestTimeout: 10000,
        });
        this.streamBuilder = new StreamBuilder_1.StreamBuilder();
        this.publisherBuilder = new PublisherBuilder_1.PublisherBuilder({
            streamBuilder: this.streamBuilder,
        });
        this.subscriberBuilder = new SubscriberBuilder_1.SubscriberBuilder({
            streamBuilder: this.streamBuilder,
        });
        this.sessionBuilder = new SessionBuilder_1.SessionBuilder({
            socketManager: this.socketManager,
            publisherBuilder: this.publisherBuilder,
            subscriberBuilder: this.subscriberBuilder,
            tokenMeta: this.tokenMeta,
            openviduConfig: this.openviduConfig,
            pingInterval: 5000,
        });
        return this.sessionBuilder.build();
    };
    OpenVidu.prototype.parseTokenUrl = function (tokenUrl) {
        var url = new url_parse_1.default(tokenUrl, true);
        var queryMap = Object.keys(url.query).reduce(function (prev, key) {
            prev.set(key, url.query[key]);
            return prev;
        }, new Map());
        var sessionId = queryMap.get('sessionId');
        if (!sessionId) {
            throw new InvalidToken_1.InvalidToken('Invalid Token, sessionId not found');
        }
        var wsUri = "wss://" + url.host + "/openvidu";
        var secret = queryMap.get('secret');
        var recorder = queryMap.get('recorder') ? true : false;
        var role = queryMap.get('role');
        if (!role) {
            throw new InvalidToken_1.InvalidToken('Invalid Token, role not found');
        }
        var stunUrl = "stun:" + url.hostname + ":3478";
        var iceServers = [{ urls: [stunUrl] }];
        var turnUsername = queryMap.get('turnUsername');
        var turnCredential = queryMap.get('turnCredential');
        if (turnUsername && turnCredential) {
            var turnUrl1 = "turn:" + url.hostname + ":3478";
            var turnUrl2 = turnUrl1 + "?transport=tcp";
            iceServers.push({
                credential: turnCredential,
                urls: [turnUrl1, turnUrl2],
                username: turnUsername,
            });
        }
        return {
            iceServers: iceServers,
            recorder: recorder,
            role: role,
            secret: secret ? secret : '',
            sessionId: sessionId,
            wsUri: wsUri,
            tokenUrl: tokenUrl,
        };
    };
    return OpenVidu;
}());
exports.OpenVidu = OpenVidu;
//# sourceMappingURL=index.js.map