import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Countdown } from "./countdown";
import { useSocketContext } from "~/client/socket/hooks/use-socket-context";
import { LOBBY_DEFAULT_OPTIONS, LOBBY_RESTART_TIMEOUT } from "~/shared/lobby/const";
import type { LobbyOptions } from "~/shared/lobby/types";
import { LobbyEvent } from "~/shared/lobby/types";
import type { PlayerInfo } from "~/shared/player/types";

import {
  Container,
  Block,
  Player,
  RestartMessage,
  WinMessage,
  EmptySlot,
} from "./styled";

type Props = {
  players: PlayerInfo[];
  options?: LobbyOptions;
};

export const InfoPanel: React.FC<Props> = ({
  players,
  options = LOBBY_DEFAULT_OPTIONS,
}) => {
  const { uuid } = useParams<{ uuid: string }>();

  const [step, setStep] = useState<number>();
  const [winner, setWinner] = useState<Nullable<string>>(null);

  const socket = useSocketContext();

  const slots = useMemo<Array<PlayerInfo | null>>(() => {
    const result: Array<PlayerInfo | null> = [];

    for (let i = 0; i < options.maxPlayers; i += 1) {
      const currentPlayer = players.find((player) => player.slot === i);
      result.push(currentPlayer ?? null);
    }

    return result;
  }, [players, options.maxPlayers]);

  const current = useMemo(() => (
    players.find((player) => player.id === socket.id)
  ), [players]);

  const clearWinner = () => {
    setWinner(null);
  };

  useEffect(() => {
    socket.on(LobbyEvent.UpdateStep, setStep);
    socket.on(LobbyEvent.PlayerWin, setWinner);
    socket.on(LobbyEvent.ClearWinner, clearWinner);

    return () => {
      socket.off(LobbyEvent.UpdateStep, setStep);
      socket.off(LobbyEvent.PlayerWin, setWinner);
      socket.off(LobbyEvent.ClearWinner, clearWinner);
    };
  }, []);

  useEffect(() => {
    if (!current) {
      return undefined;
    }

    const titleIdle = `DOTHREE #${uuid}`;
    const titleActive = "Your step!";
    let interval: NodeJS.Timeout;

    if (step === current.slot && players.length === options.maxPlayers) {
      document.title = titleActive;
      interval = setInterval(() => {
        document.title =
          document.title === titleActive ? titleIdle : titleActive;
      }, 1000);
    } else {
      document.title = titleIdle;
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [step, current && current.slot, players.length]);

  return (
    <Container>
      <Block>
        <Block.Label>Players</Block.Label>
        <Block.Value>
          {slots.map((player, slot) =>
            player ? (
              <Player key={slot} slot={slot}>
                {current && current.slot === slot && (
                  <Player.SelfLabel>You</Player.SelfLabel>
                )}
              </Player>
            ) : (
              <EmptySlot key={slot} />
            ),
          )}
        </Block.Value>
      </Block>

      {step !== undefined && (
        <Block>
          <Block.Label>Step</Block.Label>
          <Block.Value>
            <Player slot={step} />
            <Countdown
              key={step}
              limit={options.timeout}
              current={step === current?.slot}
            />
          </Block.Value>
        </Block>
      )}

      {winner && (
        <Block>
          <Block.Label />
          <Block.Value>
            <WinMessage>
              {winner === current?.id ? "You win" : "You lose"}
            </WinMessage>
            <RestartMessage>
              Restart game after {LOBBY_RESTART_TIMEOUT} seconds...
            </RestartMessage>
          </Block.Value>
        </Block>
      )}
    </Container>
  );
};
