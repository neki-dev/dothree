import React, {
  useState, useEffect, useMemo, useContext,
} from 'react';
import { useParams } from 'react-router-dom';

import { SocketContext } from '~context/SocketContext';
import CONFIG from '~root/config.json';
import { LobbyOptions } from '~type/Lobby';
import { PlayerInfo } from '~type/Player';

import { Countdown } from './Countdown';

import {
  Container, Block, Player, RestartMessage, WinMessage, EmptySlot,
} from './styled';

type ComponentProps = {
  players: PlayerInfo[]
  options: LobbyOptions
};

export function Info({ players, options }: ComponentProps) {
  const { uuid } = useParams<{ uuid: string }>();

  const [step, setStep] = useState<number>(null);
  const [winner, setWinner] = useState<string>(null);

  const socket = useContext(SocketContext);

  const slots = useMemo<Array<PlayerInfo | null>>(() => {
    const result: Array<PlayerInfo | null> = [];

    for (let i = 0; i < options.maxPlayers; i += 1) {
      const currentPlayer: PlayerInfo = players.find((player) => (player.slot === i));

      result.push(currentPlayer || null);
    }

    return result;
  }, [players, options.maxPlayers]);

  const current = useMemo<PlayerInfo>(() => (
    players.find((player) => (player.id === socket.id))
  ), [players]);

  const clearWinner = () => {
    setWinner(null);
  };

  useEffect(() => {
    socket.on('updateStep', setStep);
    socket.on('playerWin', setWinner);
    socket.on('clearWinner', clearWinner);

    return () => {
      socket.off('updateStep', setStep);
      socket.off('playerWin', setWinner);
      socket.off('clearWinner', clearWinner);
    };
  }, []);

  useEffect(() => {
    if (!current) {
      return undefined;
    }

    const titleIdle = `DOTHREE #${uuid}`;
    const titleActive = 'Your step!';
    let interval: NodeJS.Timer;

    if (step === current.slot && players.length === options.maxPlayers) {
      document.title = titleActive;
      interval = setInterval(() => {
        document.title = (document.title === titleActive) ? titleIdle : titleActive;
      }, 1000);
    } else {
      document.title = titleIdle;
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [step, (current && current.slot), players.length]);

  return (
    <Container>
      <Block>
        <Block.Label>Players</Block.Label>
        <Block.Value>
          {slots.map((player, slot) => (
            player ? (
              <Player key={slot} slot={slot} data-testid={`previewPlayer${slot}`}>
                {(current && current.slot === slot) && (
                  <Player.SelfLabel>You</Player.SelfLabel>
                )}
              </Player>
            ) : (
              <EmptySlot key={slot} />
            )
          ))}
        </Block.Value>
      </Block>
      {(step !== null) && (
        <Block>
          <Block.Label>Step</Block.Label>
          <Block.Value>
            <Player slot={step} />
            <Countdown
              key={step}
              limit={options.timeout}
              isCurrent={current && current.slot === step}
            />
          </Block.Value>
        </Block>
      )}
      {winner && (
        <Block>
          <Block.Label />
          <Block.Value>
            <WinMessage>{(winner === current.id) ? 'You win' : 'You lose'}</WinMessage>
            <RestartMessage>
              Restart game after
              {' '}
              {CONFIG.LOBBY_RESTART_TIMEOUT}
              {' '}
              seconds...
            </RestartMessage>
          </Block.Value>
        </Block>
      )}
    </Container>
  );
}
