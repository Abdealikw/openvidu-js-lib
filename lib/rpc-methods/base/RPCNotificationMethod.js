"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RPCNotificationMethod = /** @class */ (function () {
    function RPCNotificationMethod(method) {
        this.method = method;
    }
    RPCNotificationMethod.prototype.mapParam = function (param) {
        if (!param) {
            return undefined;
        }
        var transformedParam = param;
        this.param = transformedParam;
        return this.param;
    };
    return RPCNotificationMethod;
}());
exports.RPCNotificationMethod = RPCNotificationMethod;
//# sourceMappingURL=RPCNotificationMethod.js.map