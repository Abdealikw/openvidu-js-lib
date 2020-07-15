import { IConnection } from './Connection';

export interface IStream {
    streamId: string;
    createdAt: number;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    typeOfVideo: string;
    frameRate?: number;
    videoDimensions?: IVideoDimension;
    connection?: IConnection;
}

export interface IVideoDimension {
    width: number;
    height: number;
}

export class Stream implements IStream {
    public streamId: string = '';
    public createdAt: number = -1;
    public hasAudio: boolean = false;
    public hasVideo: boolean = false;
    public audioActive: boolean = false;
    public videoActive: boolean = false;
    public typeOfVideo: string = '';
    public frameRate?: number;
    public videoDimensions?: IVideoDimension;
    public connection?: IConnection;
}
