"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var idInObject = function (object) { return 'id' in object; };
var methodInObject = function (object) { return 'method' in object; };
var resultInObject = function (object) { return 'result' in object; };
var errorInObject = function (object) { return 'error' in object; };
exports.isOpenviduRequest = function (object) {
    return methodInObject(object) && idInObject(object);
};
exports.isOpenviduNotification = function (object) {
    return methodInObject(object) && !idInObject(object);
};
exports.isOpenviduResponse = function (object) {
    return idInObject(object) && (resultInObject(object) || errorInObject(object));
};
//# sourceMappingURL=jsonrpc-types.js.map