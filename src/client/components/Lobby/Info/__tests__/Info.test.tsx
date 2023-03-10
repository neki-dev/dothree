import { screen, waitFor } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/InfoProps';
import { Info } from '../index';

import { render, socket } from '~test';

describe('Lobby / Info', () => {
  beforeEach(() => {
    render(<Info {...props} />, {
      router: true,
      socket: true,
    });
  });

  it('should display players list', () => {
    const [player] = props.players;

    expect(screen.queryByTestId(`previewPlayer${player.slot}`)).toBeInTheDocument();
    expect(screen.queryByText('You')).toBeInTheDocument();
  });

  it('should not display current step, if lobby is not started', () => {
    expect(screen.queryByText('Step')).not.toBeInTheDocument();
  });

  it('should display current step, if lobby is started', () => {
    const [player] = props.players;

    socket.emitSelf('updateStep', player.slot);
    waitFor(() => {
      expect(screen.queryByText('Step')).toBeInTheDocument();
    });
  });

  it('should display winner and loser', () => {
    const [player] = props.players;

    socket.emitSelf('playerWin', player.id);
    waitFor(() => {
      expect(screen.queryByText('You lose')).toBeInTheDocument();
    });
  });
});
