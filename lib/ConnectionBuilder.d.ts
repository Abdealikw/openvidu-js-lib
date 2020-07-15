import { IConnection } from './Connection';
import { IBuilder } from './interfaces/Builder';
import { IConnectionOptions } from './interfaces/ConnectionOptions';
import { StreamBuilder } from './StreamBuilder';
import { IConnectionSession } from './Session';
export interface IConnectionBuilderConfig {
    streamBuilder: StreamBuilder;
}
export abstract class ConnectionBuilder<T extends IConnection> implements IBuilder<T> {
    connectionConfig: IConnectionBuilderConfig;
    constructor(connectionConfig: IConnectionBuilderConfig);
    abstract build(): T;
    fromConnectionOptions(opt: IConnectionOptions, session: IConnectionSession, connectionObj?: T): T;
}
//# sourceMappingURL=ConnectionBuilder.d.ts.map
