import { IConnection, IConnectionBuilderConfig } from './Connection';
import { IBuilder } from './Builder';
import { IConnectionOptions } from './ConnectionOptions';
export abstract class ConnectionBuilder<T extends IConnection> implements IBuilder<T> {
    private connectionConfig;
    constructor(connectionConfig: IConnectionBuilderConfig);
    abstract build(): T;
    fromConnectionOptions(opt: IConnectionOptions, connectionObj?: T): T;
}
//# sourceMappingURL=ConnectionBuilder.d.ts.map
