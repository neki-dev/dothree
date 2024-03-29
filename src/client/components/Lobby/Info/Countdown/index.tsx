import dayjs from 'dayjs';
import React, {
  useState, useEffect, useMemo, useContext,
} from 'react';

import { SocketContext } from '~context/SocketContext';
import { LobbyEvent } from '~type/lobby';

import { Timeleft } from './styled';

type Props = {
  limit: number
  isCurrent: boolean
};

export const Countdown: React.FC<Props> = ({ limit, isCurrent }) => {
  const [tick, setTick] = useState<number>(0);

  const socket = useContext(SocketContext);

  const date = useMemo(() => dayjs().hour(0).minute(0), []);

  useEffect(() => {
    socket.on(LobbyEvent.UpdateTimeout, setTick);

    return () => {
      socket.off(LobbyEvent.UpdateTimeout, setTick);
    };
  }, []);

  return tick > 0 ? (
    <Timeleft danger={isCurrent && tick <= Math.round(limit / 3)}>
      {date.second(tick).format('mm:ss')}
    </Timeleft>
  ) : null;
};
