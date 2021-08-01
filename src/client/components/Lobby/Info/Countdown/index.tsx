import React, {useState, useEffect, useMemo, useContext} from 'react';
import dayjs from 'dayjs';
import {SocketContext} from '~context/SocketContext';
import {Timeleft} from './styled';

interface ComponentProps {
    limit: number
    isCurrent: boolean
}

export default function Countdown({limit, isCurrent}: ComponentProps) {

    const [tick, setTick] = useState<number>(0);

    const {socket} = useContext(SocketContext);

    const date = useMemo(() => {
        return dayjs().hour(0).minute(0);
    }, []);

    useEffect(() => {
        socket.on('updateTimeout', setTick);
    }, []);

    return (tick > 0) && (
        <Timeleft danger={isCurrent && tick <= Math.round(limit / 3)}>
            {date.second(tick).format('mm:ss')}
        </Timeleft>
    );

}