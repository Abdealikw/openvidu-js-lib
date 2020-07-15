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
var ConnectionBuilder_1 = require("./ConnectionBuilder");
var Subscriber_1 = require("./Subscriber");
var SubscriberBuilder = /** @class */ (function (_super) {
    __extends(SubscriberBuilder, _super);
    function SubscriberBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SubscriberBuilder.prototype.build = function () {
        return new Subscriber_1.Subscriber();
    };
    return SubscriberBuilder;
}(ConnectionBuilder_1.ConnectionBuilder));
exports.SubscriberBuilder = SubscriberBuilder;
//# sourceMappingURL=SubscriberBuilder.js.map