import { IConnection } from './Connection';
import { IBuilder } from './interfaces/Builder';
import { IConnectionOptions } from './interfaces/ConnectionOptions';
import { StreamBuilder } from './StreamBuilder';
import { IConnectionSession } from './Session';

export interface IConnectionBuilderConfig {
    streamBuilder: StreamBuilder;
}

export abstract class ConnectionBuilder<T extends IConnection> implements IBuilder<T> {
    constructor(public connectionConfig: IConnectionBuilderConfig) {}

    public abstract build(): T;

    public fromConnectionOptions(opt: IConnectionOptions, session: IConnectionSession, connectionObj?: T): T {
        const connection = !connectionObj ? this.build() : connectionObj;
        connection.connectionId = opt.id;
        connection.data = opt.metadata;
        connection.streams = !opt.streams
            ? []
            : opt.streams.map(streamOpt => {
                  return this.connectionConfig.streamBuilder.fromStreamOptionsServer(streamOpt, connection);
              });
        connection.session = session;
        return connection;
    }
}
