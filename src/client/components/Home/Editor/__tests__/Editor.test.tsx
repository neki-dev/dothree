import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/EditorProps';
import { Editor } from '../index';

import { render, socket } from '~test';

describe('Home / Editor', () => {
  beforeEach(() => {
    render(<Editor {...props} />, {
      socket: true,
    });
  });

  it('должен отображать содержимое', () => {
    [
      'maxPlayers', 'density', 'timeout', 'useBonuses',
      'bonusing', 'moveMap', 'createLobby',
    ].forEach((id) => {
      expect(screen.queryByTestId(id)).toBeInTheDocument();
    });
  });

  it('не должен отображать частоту бонусов, если они не используются', () => {
    const checkbox = screen.queryByTestId('useBonuses');
    fireEvent.change(checkbox, { target: { value: false } });
    waitFor(() => {
      expect(screen.queryByTestId('bonusing')).not.toBeInTheDocument();
    });
  });

  it('должен отправлять запрос при нажатии на кнопку', () => {
    const onCreate = socket.hookEmit('createLobby');
    const button = screen.queryByTestId('createLobby');
    fireEvent.click(button);
    waitFor(() => {
      expect(onCreate).toBeCalled();
    });
  });
});
