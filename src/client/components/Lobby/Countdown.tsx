import React, {useState, useEffect, useRef, useMemo} from 'react';
import dayjs from 'dayjs';

interface ComponentProps {
    value: number
    isCurrent: boolean
}

export default function Countdown({value, isCurrent}: ComponentProps) {

    const [tick, setTick] = useState<number>(value);

    const refInterval = useRef(null);

    const date = useMemo(() => {
        return dayjs().hour(0).minute(0);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((tick) => (tick - 1));
        }, 1000);
        refInterval.current = interval;
        return () => {
            clearInterval(interval);
        };
    }, []);

    // ---

    return (
        <div className={`timeout ${(isCurrent && tick <= Math.round(value / 3)) ? 'danger' : ''}`}>
            {date.second(tick).format('mm:ss')}
        </div>
    );

}