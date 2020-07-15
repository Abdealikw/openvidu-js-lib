"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionBuilder = /** @class */ (function () {
    function ConnectionBuilder(connectionConfig) {
        this.connectionConfig = connectionConfig;
    }
    ConnectionBuilder.prototype.fromConnectionOptions = function (opt, connectionObj) {
        var _this = this;
        var connection = !connectionObj ? this.build() : connectionObj;
        connection.connectionId = opt.id;
        connection.data = opt.metadata;
        connection.streams = !opt.streams
            ? []
            : opt.streams.map(function (streamOpt) {
                var stream = _this.connectionConfig.streamBuilder.fromStreamOptionsServer(streamOpt);
                stream.connection = connection;
                return stream;
            });
        return connection;
    };
    return ConnectionBuilder;
}());
exports.ConnectionBuilder = ConnectionBuilder;
//# sourceMappingURL=ConnectionBuilder.js.map