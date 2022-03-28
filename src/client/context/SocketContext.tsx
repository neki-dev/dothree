import React, { createContext, ReactChild, ReactChildren } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import useSocket from '~hook/useSocket';

export const SocketContext = createContext<Socket>(null);

type PageRouteProps = {
  uuid?: string
};

type ComponentProps = {
  namespace: string
  children: ReactChild | ReactChildren
};

export function SocketProvider({ namespace, children }: ComponentProps) {
  const { uuid } = useParams<PageRouteProps>();
  const socket = useSocket(namespace, { uuid });

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
