import { useMemo } from 'react';
import io, { Socket } from 'socket.io-client';

export function useSocket(
  namespace: string,
  query: { [key: string]: string | undefined } = {},
): Socket {
  return useMemo(() => io(namespace, { query }), []);
}
