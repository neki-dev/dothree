import type { Namespace } from "socket.io";

export type LobbyParameters = {
  namespace: () => Namespace;
  onDestroy?: () => void;
};
