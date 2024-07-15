import React from "react";
import { useParams } from "react-router-dom";

import { SocketContext } from "../context";
import { useSocket } from "../hooks/use-socket";

import type { ReactElement } from "react";

type PageParams = {
  uuid?: string;
};

type Props = {
  namespace: string;
  children: ReactElement;
};

export const SocketProvider: React.FC<Props> = ({ namespace, children }) => {
  const { uuid } = useParams<PageParams>();
  const socket = useSocket(namespace, { uuid });

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
