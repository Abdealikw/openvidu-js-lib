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
var RPCNotificationMethod_1 = require("../base/RPCNotificationMethod");
var RPCRequestMethod = /** @class */ (function (_super) {
    __extends(RPCRequestMethod, _super);
    function RPCRequestMethod(method) {
        return _super.call(this, method) || this;
    }
    RPCRequestMethod.prototype.mapResult = function (result) {
        if (!result) {
            return result;
        }
        var transformedResult = result;
        this.result = transformedResult;
        return transformedResult;
    };
    return RPCRequestMethod;
}(RPCNotificationMethod_1.RPCNotificationMethod));
exports.RPCRequestMethod = RPCRequestMethod;
//# sourceMappingURL=RPCRequestMethod.js.map