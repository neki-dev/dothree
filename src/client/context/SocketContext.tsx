import React, { createContext } from "react";
import { useParams } from "react-router-dom";

import { useSocket } from "../hooks/useSocket";

import type { ReactElement } from "react";
import type { Socket } from "socket.io-client";

// @ts-ignore
export const SocketContext = createContext<Socket>(null);

type PageRouteProps = {
  uuid?: string;
};

type ComponentProps = {
  namespace: string;
  children: ReactElement;
};

export function SocketProvider({ namespace, children }: ComponentProps) {
  const { uuid } = useParams<PageRouteProps>();
  const socket = useSocket(namespace, { uuid });

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
