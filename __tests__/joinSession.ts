import { OpenVidu } from '../src/index';
import ws from 'ws';
import { fetchToken } from './fetchToken';
import { RTCPeerConnection } from 'wrtc';

const openvidu = new OpenVidu({
    platform: 'Node',
    websocketBuilder: {
        websocketCtor: ws,
    },
    webrtcBuilder: {
        rtcPeerCtor: RTCPeerConnection,
    },
    logger: {
        log: (message?: any, ...optionalParams: any[]) => {
            console.log(message, ...optionalParams);
        },
    },
});

fetchToken('SomeRandomSession').then(token => {
    const session = openvidu.initSession(token, { name: 'SomeName' });

    const unsub = session.join().subscribe(nxt => {
        console.log('Joined');
        setTimeout(() => unsub.unsubscribe(), 20000);
    });
});
