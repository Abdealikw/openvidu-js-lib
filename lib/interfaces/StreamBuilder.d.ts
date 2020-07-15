import { IBuilder } from './Builder';
import { IStream, Stream } from './Stream';
import { IStreamOptionsServer } from './StreamOptionsServer';
export declare class StreamBuilder implements IBuilder<IStream> {
    build(): Stream;
    fromStreamOptionsServer(opt: IStreamOptionsServer): IStream;
}
//# sourceMappingURL=StreamBuilder.d.ts.map
