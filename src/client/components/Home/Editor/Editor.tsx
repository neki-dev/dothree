import React, {useCallback, useState} from 'react';
import {Socket} from 'socket.io-client';
import styled from 'styled-components';
import InputRange from './InputRange';

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
        <Container>
            <Settings>
                <InputRange label="Количество игроков" name="maxPlayers" value={options.maxPlayers} min={2} max={5}
                            step={1} onChange={onChange}/>
                <InputRange label="Плотность карты" name="density" value={options.density} min={0} max={40} step={5}
                            onChange={onChange}/>
                <InputRange label="Частота бонусов" name="bonusing" value={options.bonusing} min={0} max={5} step={1}
                            onChange={onChange}/>
                <InputRange label="Таймаут хода" name="timeout" value={options.timeout} min={5} max={60} step={5}
                            onChange={onChange}/>
                {/*<InputRange label="Длина комбинации" name="targetLength" value={options.targetLength} min={3} max={4} step={1} onChange={onChange} />*/}
            </Settings>
            <Actions>
                <ButtonBack onClick={() => onClose()}>Назад</ButtonBack>
                <ButtonCreate onClick={createLobby}>Создать игру</ButtonCreate>
            </Actions>
        </Container>
    );

}

const Container = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Settings = styled.div`
  margin-bottom: 30px;
`;

const Actions = styled.div`
  display: flex;
`;

const ButtonCreate = styled.button.attrs({
    tabIndex: 1,
})`
  border: none;
  color: #fff;
  background: #ff5d00;
  padding: 14px 22px;
  border-radius: 3px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.1s ease-in;

  &:hover,
  &:focus {
    cursor: pointer;
    background: #684473;
  }
`;

const ButtonBack = styled.div.attrs({
    tabIndex: 1,
})`
  border: none;
  color: #fff;
  background: #5b6b7d;
  padding: 14px 22px;
  border-radius: 3px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.1s ease-in;
  margin-right: 10px;

  &:hover,
  &:focus {
    cursor: pointer;
    background: #684473;
  }
`;