import { useMemo } from 'react';
import io, { Socket } from 'socket.io-client';

export default function useSocket(
  namespace: string,
  query: { [key: string]: string } = {},
): Socket {
  return useMemo(() => io(namespace, { query }), []);
}
