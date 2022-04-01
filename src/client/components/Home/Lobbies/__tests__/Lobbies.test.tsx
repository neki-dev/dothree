import React from 'react';
import {
  fireEvent, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import render from '~test/render';
import socket from '~test/socket';

import Lobbies from '../index';
import lobby from '../__mocks__/Lobby';

describe('Home / Lobbies', () => {
  beforeAll(() => {
    render(<Lobbies />, {
      router: true,
      socket: true,
    });
  });

  it('должен отображать заголовок только если количество лобби больше нуля', () => {
    const title = 'Или выбрать существующую';
    waitFor(() => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
      socket.emitSelf('updateLatestLobbies', [lobby]);
      waitFor(() => {
        expect(screen.queryByText(title)).toBeInTheDocument();
      });
    });
  });

  it('должен отображать список лобби', () => {
    socket.emitSelf('updateLatestLobbies', [lobby]);
    waitFor(() => {
      expect(screen.queryByText(lobby.uuid)).toBeInTheDocument();
    });
  });

  it('должен содержать ссылки на лобби', () => {
    socket.emitSelf('updateLatestLobbies', [lobby]);
    waitFor(() => {
      const link = screen.queryByTestId('open-lobby');
      fireEvent.click(link);
      expect(link.getAttribute('href')).toBe(`/game/${lobby.uuid}`);
    });
  });
});
