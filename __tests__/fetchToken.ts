import axios from 'axios';
import { secrets } from './secrets/config';

export const fetchToken = async (sessionName: string) => {
    const url = `${secrets.tokenFetchUrl}?sessionName=${sessionName}`;
    const headers = {
        Authorization: `Bearer ${secrets.authSecret}`,
    };
    const res = await axios({ url, headers, method: 'POST' });
    return res.data.token as string;
};
