import { useContext } from "react";

import { WorldContext } from "../context";

export function useWorldContext() {
  const context = useContext(WorldContext);

  if (!context) {
    throw Error('Hook useWorldContext must be inside provider');
  }

  return context;
}
