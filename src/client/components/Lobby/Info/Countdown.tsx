import React, {useState, useEffect, useRef, useMemo} from 'react';
import dayjs from 'dayjs';
import styled, {keyframes, css} from 'styled-components';

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
        <Timeleft danger={isCurrent && tick <= Math.round(value / 3)}>
            {date.second(tick).format('mm:ss')}
        </Timeleft>
    );

}

const AnimationPulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

const Timeleft: any = styled.div<{
    danger: boolean
}>`
  font-size: 16px;
  margin-left: 10px;
  color: ${(p) => (p.danger ? '#ffbb00' : '#5b6b7d')};
  ${(p) => p.danger && css`
    animation: 1s linear ${AnimationPulse};
  `};
`;