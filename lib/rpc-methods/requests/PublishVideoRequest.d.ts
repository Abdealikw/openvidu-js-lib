import { RPCRequestMethod } from '../base/RPCRequestMethod';
export interface IPublishVideoRequestParam {
    sdpOffer: string;
    doLoopback: boolean;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    typeOfVideo: string;
    frameRate?: number;
    videoDimensions?: string;
    filter?: undefined;
}
export interface IPublishVideoResponseParam {
    sdpAnswer: string;
    id: string;
    createdAt: number;
}
export declare class PublishVideoRequest extends RPCRequestMethod<
    IPublishVideoRequestParam,
    IPublishVideoResponseParam
> {
    param: IPublishVideoRequestParam;
    constructor(param: IPublishVideoRequestParam);
}
//# sourceMappingURL=PublishVideoRequest.d.ts.map
