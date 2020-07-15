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
var RPCRequestMethod_1 = require("../base/RPCRequestMethod");
var methods_1 = require("../base/methods");
var ReceiveVideoFromRequest = /** @class */ (function (_super) {
    __extends(ReceiveVideoFromRequest, _super);
    function ReceiveVideoFromRequest(param) {
        var _this = _super.call(this, methods_1.RPCMethod.receiveVideoFrom) || this;
        _this.param = param;
        return _this;
    }
    return ReceiveVideoFromRequest;
}(RPCRequestMethod_1.RPCRequestMethod));
exports.ReceiveVideoFromRequest = ReceiveVideoFromRequest;
//# sourceMappingURL=ReceiveVideoFromRequest.js.map