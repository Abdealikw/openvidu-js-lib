"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionBuilder = /** @class */ (function () {
    function ConnectionBuilder(connectionConfig) {
        this.connectionConfig = connectionConfig;
    }
    ConnectionBuilder.prototype.fromConnectionOptions = function (opt, session, connectionObj) {
        var _this = this;
        var connection = !connectionObj ? this.build() : connectionObj;
        connection.connectionId = opt.id;
        connection.data = opt.metadata;
        connection.streams = !opt.streams
            ? []
            : opt.streams.map(function (streamOpt) {
                return _this.connectionConfig.streamBuilder.fromStreamOptionsServer(streamOpt, connection);
            });
        connection.session = session;
        return connection;
    };
    return ConnectionBuilder;
}());
exports.ConnectionBuilder = ConnectionBuilder;
//# sourceMappingURL=ConnectionBuilder.js.map