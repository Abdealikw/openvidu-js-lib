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
var methods_1 = require("../base/methods");
var IceCandidateNotification = /** @class */ (function (_super) {
    __extends(IceCandidateNotification, _super);
    function IceCandidateNotification() {
        return _super.call(this, methods_1.RPCMethod.iceCandidate) || this;
    }
    return IceCandidateNotification;
}(RPCNotificationMethod_1.RPCNotificationMethod));
exports.IceCandidateNotification = IceCandidateNotification;
//# sourceMappingURL=IceCandidateNotification.js.map