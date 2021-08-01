import React, {createContext} from 'react';
import {useParams} from 'react-router-dom';
import {Socket} from 'socket.io-client';
import useSocket from '~hook/useSocket';

interface Functionaly {
    socket: Socket
}

export const SocketContext = createContext({} as Functionaly);

interface ComponentProps {
    namespace: string
    children: any
}

export function SocketProvider({namespace, children}: ComponentProps) {

    const params = useParams<{uuid: string}>();
    const socket: Socket = useSocket(namespace, params);

    const value: Functionaly = {socket};

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );

}
