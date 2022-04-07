import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import '~test/preset';
import render from '~test/render';
import socket from '~test/socket';

import Countdown from '../index';
import props from '../__mocks__/CountdownProps';

describe('Lobby / Info / Countdown', () => {
  beforeEach(() => {
    render(<Countdown {...props} />, {
      socket: true,
    });
  });

  it('не должен отображаться при нулевом значении', () => {
    expect(screen.queryByText('00:00')).not.toBeInTheDocument();
  });

  it('должен отображаться при значении больше нуля', () => {
    socket.emitSelf('updateTimeout', 60);
    waitFor(() => {
      expect(screen.queryByText('60:00')).toBeInTheDocument();
    });
  });
});
