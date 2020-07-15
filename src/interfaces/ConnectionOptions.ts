import { IStreamOptionsServer } from './StreamOptionsServer';

export interface IConnectionOptions {
    id: string;
    createdAt?: number;
    metadata: string;
    streams?: IStreamOptionsServer[];
}
