import { RPCRequestMethod } from '../base/RPCRequestMethod';
import { RPCMethod } from '../base/methods';

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

export class PublishVideoRequest extends RPCRequestMethod<IPublishVideoRequestParam, IPublishVideoResponseParam> {
    constructor(public param: IPublishVideoRequestParam) {
        super(RPCMethod.publishVideo);
    }
}
