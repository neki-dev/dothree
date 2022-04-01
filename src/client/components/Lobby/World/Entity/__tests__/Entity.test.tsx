import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import render from '~test/render';
import { WorldContext } from '~context/WorldContext';

import Entity from '../index';
import props from '../__mocks__/EntityProps';
import world from '../__mocks__/World';

describe('Lobby / World / Entity', () => {
  function renderWithWorld(customProps = {}) {
    render(
      <WorldContext.Provider value={world}>
        <Entity {...props} {...customProps} />
      </WorldContext.Provider>,
    );
  }

  it('не должен обрабатывать клик, если не свой ход', () => {
    renderWithWorld({
      isCurrentStep: false,
    });

    const entity = screen.getByTestId('entity');
    fireEvent.click(entity);
    expect(props.onPut).not.toBeCalled();
  });

  it('не должен обрабатывать клик, если позиция находится в воздухе', () => {
    renderWithWorld({
      isCurrentStep: true,
    });

    const entity = screen.getByTestId('entity');
    fireEvent.click(entity);
    expect(props.onPut).not.toBeCalled();
  });

  it('должен обрабатывать клик, если свой ход и позволяет позиция', () => {
    renderWithWorld({
      isCurrentStep: true,
      y: 1,
    });

    const entity = screen.getByTestId('entity');
    fireEvent.click(entity);
    expect(props.onPut).toBeCalled();
  });
});
