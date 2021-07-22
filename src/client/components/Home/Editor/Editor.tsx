import React, {useEffect, useCallback, useState} from 'react';
import {Socket} from 'socket.io-client';
import InputRange from './InputRange';

import './styles.scss';

interface ComponentProps {
    socket: Socket;
    onClose?: Function;
}

export default function Editor({socket, onClose}: ComponentProps) {

    const [options, setOptions] = useState({
        maxPlayers: 3,
        density: 10,
        bonusing: 2,
        timeout: 30,
        targetLength: 3,
    });

    const onChange = useCallback((e) => {
        const input = e.target;
        setOptions((options) => ({
            ...options,
            [input.name]: Number(input.value),
        }));
    }, []);

    const createLobby = useCallback((e) => {
        e.preventDefault();
        socket.emit('createLobby', options, (uuid: string) => {
            window.open(`/game/${uuid}`);
            if (onClose) {
                onClose();
            }
        });
    }, [options, onClose]);

    // ---

    return (
        <form method="post" className="editor">
            <div className="inputs">
                <InputRange label="Количество игроков" name="maxPlayers" value={options.maxPlayers} min={2} max={5} step={1} onChange={onChange} />
                <InputRange label="Плотность карты" name="density" value={options.density} min={0} max={40} step={5} onChange={onChange} />
                <InputRange label="Частота бонусов" name="bonusing" value={options.bonusing} min={0} max={5} step={1} onChange={onChange} />
                <InputRange label="Таймаут хода" name="timeout" value={options.timeout} min={5} max={60} step={5} onChange={onChange} />
                {/*<InputRange label="Длина комбинации" name="targetLength" value={options.targetLength} min={3} max={4} step={1} onChange={onChange} />*/}
            </div>
            <div className="buttons">
                <div onClick={() => onClose()} className="button close">Назад</div>
                <button onClick={createLobby}>Создать игру</button>
            </div>
        </form>
    );

}