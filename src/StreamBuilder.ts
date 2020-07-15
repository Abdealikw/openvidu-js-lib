import { IBuilder } from './interfaces/Builder';
import { IStream, Stream } from './Stream';
import { IStreamOptionsServer } from './interfaces/StreamOptionsServer';
import { IPublishProperties } from './Publisher';
import { IConnection } from './Connection';

export class StreamBuilder implements IBuilder<IStream> {
    public build() {
        return new Stream();
    }

    public fromStreamOptionsServer(opt: IStreamOptionsServer, connection: IConnection): IStream {
        const stream = this.build();
        stream.streamId = opt.id;
        stream.audioActive = opt.audioActive;
        stream.createdAt = opt.createdAt;
        stream.frameRate = opt.frameRate;
        stream.hasAudio = opt.hasAudio;
        stream.hasVideo = opt.hasVideo;
        stream.typeOfVideo = opt.typeOfVideo;
        stream.videoActive = opt.videoActive;
        stream.videoDimensions = opt.videoDimensions ? JSON.parse(opt.videoDimensions) : undefined;
        stream.connection = connection;
        return stream;
    }

    public fromPublisherOptions(id: string, opt: IPublishProperties, connection: IConnection) {
        const stream = this.build();
        stream.streamId = id;
        stream.audioActive = opt.audioActive;
        stream.frameRate = opt.frameRate;
        stream.hasAudio = opt.hasAudio;
        stream.hasVideo = opt.hasVideo;
        stream.typeOfVideo = opt.typeOfVideo;
        stream.videoActive = opt.videoActive;
        stream.videoDimensions = opt.videoDimensions;
        return stream;
    }
}
