import React, { useCallback, useContext, useState } from 'react';

import { Button } from '../Button';
import { DEFAULT_OPTIONS } from '~class/Lobby';
import { SocketContext } from '~context/SocketContext';
import { LobbyEvent, LobbyOptions } from '~type/lobby';

import { InputCheckbox } from './InputCheckbox';
import { InputRange } from './InputRange';

import { Form, Settings } from './styled';

type ComponentProps = {
  onClose?: () => void
};

export function Editor({ onClose }: ComponentProps) {
  const [options, setOptions] = useState<LobbyOptions>(DEFAULT_OPTIONS);

  const socket = useContext(SocketContext);

  const onChange = useCallback((name: string, value: number | boolean) => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [name]: value,
    }));
  }, []);

  const createLobby = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    socket.emit(LobbyEvent.CreateLobby, options, (uuid: string) => {
      window.open(`/game/${uuid}`);

      if (onClose) {
        onClose();
      }
    });
  }, [options, onClose]);

  return (
    <Form>
      <Settings>
        <InputRange
          label="Max players" name="maxPlayers" defaultValue={options.maxPlayers}
          min={2} max={5} onChange={onChange}
          tooltip="Number of players required to start game"
        />
        <InputRange
          label="Map density" name="density" defaultValue={options.density}
          min={0} max={4} step={1}
          onChange={onChange}
          tooltip="World cubes spawn rate"
        />
        <InputRange
          label="Step timeout" name="timeout" defaultValue={options.timeout}
          min={5} max={60} step={5}
          onChange={onChange}
          tooltip="Number of seconds allocated per step"
        />
        <InputCheckbox
          label="Use bonuses" name="useBonuses" value={options.useBonuses}
          onChange={onChange}
        />
        {options.useBonuses && (
          <InputRange
            label="Bonus frequency" name="bonusing" defaultValue={options.bonusing}
            min={1} max={5} onChange={onChange}
            tooltip="Bonus spawn rate"
          />
        )}
        <InputCheckbox
          label="Movable map" name="moveMap" value={options.moveMap}
          onChange={onChange}
          tooltip="With a moving map, after each step, there is a shift one cell to left"
        />
      </Settings>
      <Button onClick={createLobby} name="createLobby">Accept</Button>
    </Form>
  );
}

Editor.defaultProps = {
  onClose: undefined,
};
