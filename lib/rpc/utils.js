"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Logger_1 = require("../Logger");
exports.configureRetryOnError = function (retryTimes, canRetry) {
    if (retryTimes === void 0) { retryTimes = Number.POSITIVE_INFINITY; }
    return function (err$) {
        return err$.pipe(operators_1.mergeMap(function (error) {
            var canRetry$ = canRetry(error);
            if (canRetry$) {
                return canRetry$;
            }
            return rxjs_1.throwError(error);
        }), operators_1.scan(function (acc, error) {
            var accumulator = acc.accumulator;
            return {
                accumulator: accumulator + 1,
                error: error,
            };
        }, { accumulator: 0, error: null }), operators_1.mergeMap(function (_a) {
            var accumulator = _a.accumulator, error = _a.error;
            if (accumulator >= retryTimes) {
                return rxjs_1.throwError(error);
            }
            return rxjs_1.of(error);
        }), operators_1.catchError(function (error) {
            return rxjs_1.throwError(error);
        }));
    };
};
exports.configureRetryOnTimeout = function (retryTimes, notifier) {
    if (retryTimes === void 0) { retryTimes = Number.POSITIVE_INFINITY; }
    return exports.configureRetryOnError(retryTimes, function (error) {
        var val = error.name && error.name === 'TimeoutError';
        if (val) {
            Logger_1.getLogger().log('TimeoutError... Can Retry');
            return notifier ? notifier : rxjs_1.of(val);
        }
    });
};
//# sourceMappingURL=utils.js.map