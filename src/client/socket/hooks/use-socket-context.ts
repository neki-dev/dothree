import { useContext } from "react";

import { SocketContext } from "../context";

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw Error('Hook useSocketContext must be inside provider');
  }

  return context;
}
