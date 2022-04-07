import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '~test/preset';
import render from '~test/render';
import socket from '~test/socket';

import Info from '../index';
import props from '../__mocks__/InfoProps';

describe('Lobby / Info', () => {
  beforeEach(() => {
    render(<Info {...props} />, {
      router: true,
      socket: true,
    });
  });

  it('должен отображать список игроков', () => {
    const [player] = props.players;
    expect(screen.queryByTestId(`previewPlayer${player.slot}`)).toBeInTheDocument();
    expect(screen.queryByText('Вы')).toBeInTheDocument();
  });

  it('не должен отображать текущий ход, если игра неактивна', () => {
    expect(screen.queryByText('Ход')).not.toBeInTheDocument();
  });

  it('должен отображать текущий ход, если игра активна', () => {
    const [player] = props.players;
    socket.emitSelf('updateStep', player.slot);
    waitFor(() => {
      expect(screen.queryByText('Ход')).toBeInTheDocument();
    });
  });

  it('должен отображать победителя в конце игры', () => {
    const [player] = props.players;
    socket.emitSelf('playerWin', player.id);
    waitFor(() => {
      expect(screen.queryByText('Вы выиграли')).toBeInTheDocument();
    });
  });
});
