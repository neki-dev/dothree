import {useMemo} from 'react';
import io from 'socket.io-client';

export default (namespace, params = {}) => {

    return useMemo(() => {
        const query = Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
        return io.connect(namespace, {query});
    }, []);

};