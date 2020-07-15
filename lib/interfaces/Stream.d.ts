import { IConnection } from './Connection';
export interface IStream {
    streamId: string;
    createdAt: number;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    typeOfVideo: string;
    frameRate: number;
    videoDimensions?: IVideoDimension;
    connection?: IConnection;
}
export interface IVideoDimension {
    width: number;
    height: number;
}
export declare class Stream implements IStream {
    streamId: string;
    createdAt: number;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    typeOfVideo: string;
    frameRate: number;
    videoDimensions?: IVideoDimension;
    connection?: IConnection;
}
//# sourceMappingURL=Stream.d.ts.map
