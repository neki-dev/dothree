import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/EntityProps';
import world from '../__mocks__/World';
import { Entity } from '../index';
import { WorldContext } from '~context/WorldContext';

import { render } from '~test';

describe('Lobby / World / Entity', () => {
  function renderWithWorld(customProps = {}) {
    render(
      <WorldContext.Provider value={world}>
        <Entity {...props} {...customProps} />
      </WorldContext.Provider>,
    );
  }

  it('should not handle click, if not you step', () => {
    renderWithWorld({
      isCurrentStep: false,
    });

    const entity = screen.getByTestId('entity');
    fireEvent.click(entity);
    expect(props.onPut).not.toBeCalled();
  });

  it('should not handle click, if position without baseground', () => {
    renderWithWorld({
      isCurrentStep: true,
    });

    const entity = screen.getByTestId('entity');
    fireEvent.click(entity);
    expect(props.onPut).not.toBeCalled();
  });

  it('should handle click, if you step and correct position', () => {
    renderWithWorld({
      isCurrentStep: true,
      y: 1,
    });

    const entity = screen.getByTestId('entity');
    fireEvent.click(entity);
    expect(props.onPut).toBeCalled();
  });
});
