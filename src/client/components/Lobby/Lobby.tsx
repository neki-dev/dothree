import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Socket} from 'socket.io-client';
import styled, {keyframes, css} from 'styled-components';
import useSocket from '~hook/useSocket';
import Info from './Info';
import World from './World';

import LobbyOptions from '~type/LobbyOptions';
import PlayerInfo from '~type/PlayerInfo';

export default function Lobby() {

    const {uuid} = useParams<{ uuid: string }>();
    const socket: Socket = useSocket('/lobby', {uuid});

    const [error, setError] = useState<string>(null);
    const [options, setOptions] = useState<LobbyOptions>(null);
    const [players, setPlayers] = useState<PlayerInfo[]>([]);

    useEffect(() => {
        socket.on('lobbyError', setError);
        socket.on('updatePlayers', setPlayers);
        socket.on('sendOptions', setOptions);
    }, []);

    // ---

    return (
        <Container>
            {error ? (
                <ErrorWrapper>
                    <ErrorMessage>{error}</ErrorMessage>
                </ErrorWrapper>
            ) : (
                <>
                    {(!options || players.length < options.maxPlayers) && (
                        <WaitingOverlay>
                            {options && (
                                <>
                                    <Loading>
                                        {Array(options.maxPlayers).fill(0).map((v, i) => (
                                            <Slot key={i} index={i} empty={i + 1 > players.length}/>
                                        ))}
                                    </Loading>
                                    <Status>
                                        <StatusLetters>Вошло</StatusLetters>
                                        <StatusLetters number>{players.length}</StatusLetters>
                                        <StatusLetters>из</StatusLetters>
                                        <StatusLetters number>{options.maxPlayers}</StatusLetters>
                                        <StatusLetters>игроков</StatusLetters>
                                    </Status>
                                </>
                            )}
                        </WaitingOverlay>
                    )}
                    <GameScreen>
                        <World socket={socket} players={players}/>
                        <Info socket={socket} players={players} options={options || {}}/>
                    </GameScreen>
                </>
            )}
        </Container>
    );

}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const GameScreen = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  justify-content: center;
  flex: 1;
  overflow: hidden;
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  background: #c92929;
  height: 100%;
`;

const ErrorMessage = styled.span`
  max-width: 30%;
  color: #fff;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
`;

const WaitingOverlay = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: #0f141a;
  z-index: 999;
  flex-direction: column;
`;

const Loading = styled.div`
  margin-bottom: 50px;
`;

const AnimationJumping = keyframes`
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, 22px);
  }
`;

const Slot: any = styled.div<{
    index: number
    empty: boolean
}>`
  display: inline-block;
  width: 32px;
  height: 32px;
  border-radius: 8%;
  margin: 8px;
  animation: 0.8s linear infinite ${AnimationJumping};
  background: ${(p) => {
    if (p.empty) {
      return css`rgba(255, 255, 255, 0.5)`;
    }
    switch (p.index) {
      case 0:
        return css`linear-gradient(135deg, #ffb300 0%, #ff7300 100%)`;
      case 1:
        return css`linear-gradient(135deg, #e47dff 0%, #9248a6 100%)`;
      case 2:
        return css`linear-gradient(135deg, #3dcbf0 0%, #1b86a2 100%)`;
      case 3:
        return css`linear-gradient(135deg, #f05656 0%, #b53a3a 100%)`;
      case 4:
        return css`linear-gradient(135deg, #a3e75f 0%, #5ea21b 100%)`;
    }
  }};

  &:nth-child(1) {
    animation-delay: 0.1s;
  }

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  &:nth-child(4) {
    animation-delay: 0.4s;
  }

  &:nth-child(5) {
    animation-delay: 0.5s;
  }
`;

const Status = styled.div`
  margin-top: 10px;
  align-items: center;
  display: flex;
`;

const StatusLetters: any = styled.div<{
    number: boolean
}>`
  text-transform: uppercase;
  font-size: ${(p) => (p.number ? '32px' : '18px')};
  font-weight: ${(p) => (p.number ? 700 : 200)};
  opacity: ${(p) => (p.number ? 0.9 : 0.5)};
  margin-top: ${(p) => (p.number ? '-1px' : 0)};

  &:not(:last-child) {
    margin-right: 15px;
  }
`;