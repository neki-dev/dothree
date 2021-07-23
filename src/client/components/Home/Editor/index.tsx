import React, {useCallback, useState} from 'react';
import {Socket} from 'socket.io-client';
import InputRange from './InputRange';
import InputCheckbox from './InputCheckbox';
import {Container, Settings, Actions, ButtonBack, ButtonCreate} from './styled';

import LobbyOptions from '~type/LobbyOptions';

interface ComponentProps {
    socket: Socket;
    onClose?: Function;
}

export default function Editor({socket, onClose}: ComponentProps) {

    const [options, setOptions] = useState<LobbyOptions>({
        maxPlayers: 3,
        density: 10,
        bonusing: 2,
        timeout: 30,
        targetLength: 3,
        moveMap: false,
        useBonuses: true,
    });

    const onChange = useCallback((name: string, value: number | boolean) => {
        setOptions((options) => ({
            ...options,
            [name]: value,
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

    return (
        <Container>
            <Settings>
                <InputRange label="Количество игроков" name="maxPlayers" value={options.maxPlayers} min={2} max={5} onChange={onChange} />
                <InputRange label="Плотность карты" name="density" value={options.density} min={0} max={40} step={5} onChange={onChange} />
                <InputRange label="Таймаут хода" name="timeout" value={options.timeout} min={5} max={60} step={5} onChange={onChange} />
                <InputCheckbox label="Использовать бонусы" name="useBonuses" value={options.useBonuses} onChange={onChange} />
                {options.useBonuses && <InputRange label="Частота бонусов" name="bonusing" value={options.bonusing} min={1} max={5} onChange={onChange} />}
                <InputCheckbox label="Подвижная карта" name="moveMap" value={options.moveMap} onChange={onChange} />
            </Settings>
            <Actions>
                <ButtonBack onClick={() => onClose()}>Назад</ButtonBack>
                <ButtonCreate onClick={createLobby}>Создать игру</ButtonCreate>
            </Actions>
        </Container>
    );

}

