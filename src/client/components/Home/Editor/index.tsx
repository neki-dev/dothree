import React, { useCallback, useContext, useState } from 'react';
import { SocketContext } from '~context/SocketContext';
import InputRange from './InputRange';
import InputCheckbox from './InputCheckbox';
import Button from '../Button';
import { LobbyOptions } from '~type/Lobby';
import { Form, Settings } from './styled';

type ComponentProps = {
  onClose?: Function
};

export default function Editor({ onClose }: ComponentProps) {
  const [options, setOptions] = useState<LobbyOptions>({
    maxPlayers: 3,
    density: 1,
    bonusing: 2,
    timeout: 30,
    targetLength: 3,
    moveMap: false,
    useBonuses: true,
  });

  const socket = useContext(SocketContext);

  const onChange = useCallback((name: string, value: number | boolean) => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      [name]: value,
    }));
  }, []);

  const createLobby = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    socket.emit('createLobby', options, (uuid: string) => {
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
          label="Количество игроков" name="maxPlayers" defaultValue={options.maxPlayers}
          min={2} max={5} onChange={onChange}
          tooltip="Количество игроков, необходимое для начала игры"
        />
        <InputRange
          label="Плотность карты" name="density" defaultValue={options.density}
          min={0} max={4} step={1}
          onChange={onChange}
          tooltip="Коэффициент спавна блоков мира"
        />
        <InputRange
          label="Таймаут хода" name="timeout" defaultValue={options.timeout}
          min={5} max={60} step={5}
          onChange={onChange}
          tooltip="Количество секунд, за которые игрок должен сделать свой ход"
        />
        <InputCheckbox
          label="Использовать бонусы" name="useBonuses" value={options.useBonuses}
          onChange={onChange}
        />
        {options.useBonuses && (
        <InputRange
          label="Частота бонусов" name="bonusing" defaultValue={options.bonusing}
          min={1} max={5} onChange={onChange}
          tooltip="Коэффициент спавна бонусов"
        />
        )}
        <InputCheckbox
          label="Подвижная карта" name="moveMap" value={options.moveMap}
          onChange={onChange}
          tooltip="При подвижной карте после каждого хода идет смещение на один блок влево"
        />
      </Settings>
      <Button onClick={createLobby}>Продолжить</Button>
    </Form>
  );
}

Editor.defaultProps = {
  onClose: undefined,
};
