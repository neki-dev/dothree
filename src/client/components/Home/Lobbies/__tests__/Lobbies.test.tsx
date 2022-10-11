import {
  fireEvent, screen, waitFor,
} from '@testing-library/react';
import React from 'react';

import lobby from '../__mocks__/Lobby';
import { Lobbies } from '../index';

import { render, socket } from '~test';

describe('Home / Lobbies', () => {
  beforeAll(() => {
    render(<Lobbies />, {
      router: true,
      socket: true,
    });
  });

  it('should display title, only if lobbies count more zero', () => {
    const title = 'Or select existing';
    waitFor(() => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
      socket.emitSelf('updateLatestLobbies', [lobby]);
      waitFor(() => {
        expect(screen.queryByText(title)).toBeInTheDocument();
      });
    });
  });

  it('should display lobbies list', () => {
    socket.emitSelf('updateLatestLobbies', [lobby]);
    waitFor(() => {
      expect(screen.queryByText(lobby.uuid)).toBeInTheDocument();
    });
  });

  it('should redirect to lobby, if link was clicked', () => {
    socket.emitSelf('updateLatestLobbies', [lobby]);
    waitFor(() => {
      const link = screen.queryByTestId('open-lobby');
      fireEvent.click(link);
      expect(link.getAttribute('href')).toBe(`/game/${lobby.uuid}`);
    });
  });
});
