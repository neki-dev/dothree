import { screen } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/WaitingProps';
import { Waiting } from '../index';

import { render } from '~test';

describe('Lobby / Waiting', () => {
  beforeEach(() => {
    render(<Waiting {...props} />, {
      router: true,
    });
  });

  it('должен отображать количество подключившихся игроков', () => {
    expect(screen.queryByTestId('waitingCurrentPlayers').textContent)
      .toContain(String(props.currentPlayers));
  });

  it('должен отображать максимальное количество игроков', () => {
    expect(screen.queryByTestId('waitingMaxPlayers').textContent)
      .toContain(String(props.maxPlayers));
  });
});
