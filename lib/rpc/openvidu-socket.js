"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var webSocket_1 = require("rxjs/webSocket");
var jsonrpc_types_1 = require("./jsonrpc-types");
var JsonRPCError_1 = require("../errors/JsonRPCError");
var rxjs_1 = require("rxjs");
var Logger_1 = require("../Logger");
var utils_1 = require("./utils");
var OpenviduSocketManager = /** @class */ (function () {
    function OpenviduSocketManager(config) {
        this.config = config;
        this.configureRetryOnCloseEvent = function (retryTimes) {
            if (retryTimes === void 0) { retryTimes = Number.POSITIVE_INFINITY; }
            return utils_1.configureRetryOnError(retryTimes, function (error) {
                var val = error.code && error.code;
                if (val) {
                    Logger_1.getLogger().log("CloseEvent... code:" + error.code + "... reason:" + error.reason + " Can Retry");
                    return rxjs_1.of(val);
                }
            });
        };
        this.idGenerator = this.createIdGenerator();
        this.socket = this.setupSocket();
    }
    OpenviduSocketManager.prototype.observeNotification = function (notification) {
        return this.getSocketObservable().pipe(operators_1.filter(function (val) { return jsonrpc_types_1.isOpenviduNotification(val); }), operators_1.map(function (val) { return val; }), operators_1.filter(function (val) { return val.method === notification.method.toString(); }), operators_1.tap(function (val) { return Logger_1.getLogger().log('received notification: ', JSON.stringify(val)); }), operators_1.map(function (val) { return notification.mapParam(val.params); }));
    };
    OpenviduSocketManager.prototype.sendRequestAndObserveOne = function (request) {
        var requestId = this.getRequestId();
        return this.sendRequestAndObserveResponse(request, requestId);
    };
    OpenviduSocketManager.prototype.sendRequestAndObserveResponse = function (request, requestId) {
        var _this = this;
        return new rxjs_1.Observable(function (subscriber) {
            _this.sendRequest(request, requestId);
            return _this.observeResponse(function (res) { return res.id === requestId; })
                .pipe(operators_1.take(1), operators_1.timeout(_this.config.requestTimeout), operators_1.map(function (val) {
                if (val.error) {
                    throw new JsonRPCError_1.JsonRPCError(val.error);
                }
                return request.mapResult(val.result);
            }))
                .subscribe(subscriber);
        });
    };
    OpenviduSocketManager.prototype.sendRequest = function (request, id) {
        var openviduReq = {
            jsonrpc: '2.0',
            id: id,
            method: request.method.toString(),
        };
        if (request.param) {
            openviduReq.params = request.param;
        }
        Logger_1.getLogger().log('sending request:', JSON.stringify(openviduReq));
        this.socket.next(openviduReq);
    };
    OpenviduSocketManager.prototype.setupSocket = function () {
        return webSocket_1.webSocket({
            WebSocketCtor: this.config.websocketCtor,
            url: this.config.url,
            closeObserver: {
                next: function (_) { return Logger_1.getLogger().log('closeObserver next'); },
            },
            closingObserver: {
                next: function (_) { return Logger_1.getLogger().log('closingObserver next'); },
            },
            openObserver: {
                next: function (_) { return Logger_1.getLogger().log('openObserver next'); },
            },
        });
    };
    OpenviduSocketManager.prototype.observeResponse = function (filterPredicate) {
        return this.getSocketObservable().pipe(operators_1.filter(function (val) { return jsonrpc_types_1.isOpenviduResponse(val); }), operators_1.map(function (val) { return val; }), operators_1.filter(filterPredicate), operators_1.tap(function (resp) { return Logger_1.getLogger().log('received response: ', JSON.stringify(resp)); }));
    };
    OpenviduSocketManager.prototype.getSocketObservable = function () {
        return this.socket.asObservable().pipe(operators_1.repeatWhen(function (notification) {
            return notification.pipe(operators_1.tap(function (_) { return Logger_1.getLogger().log('Socket complete. Restarting...', _); }));
        }), operators_1.retryWhen(this.configureRetryOnCloseEvent()));
    };
    OpenviduSocketManager.prototype.getRequestId = function () {
        var nextId = this.idGenerator.next();
        if (nextId.done) {
            this.idGenerator = this.createIdGenerator();
            nextId = this.idGenerator.next();
        }
        return nextId.value;
    };
    OpenviduSocketManager.prototype.createIdGenerator = function () {
        return this.range(1, Number.MAX_SAFE_INTEGER);
    };
    OpenviduSocketManager.prototype.range = function (start, count, step) {
        var counter;
        if (step === void 0) { step = 1; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    counter = start;
                    _a.label = 1;
                case 1:
                    if (!(counter < count)) return [3 /*break*/, 3];
                    return [4 /*yield*/, counter];
                case 2:
                    _a.sent();
                    counter = counter + step;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    return OpenviduSocketManager;
}());
exports.OpenviduSocketManager = OpenviduSocketManager;
//# sourceMappingURL=openvidu-socket.js.map