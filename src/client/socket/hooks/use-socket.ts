import { useMemo } from "react";
import { io } from "socket.io-client";

import type { Socket } from "socket.io-client";

export function useSocket(
  namespace: string,
  query: { [key: string]: string | undefined } = {},
): Socket {
  return useMemo(() => io(namespace, { query }), []);
}
