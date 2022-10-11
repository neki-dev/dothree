import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/InputCheckboxProps';
import { InputCheckbox } from '../index';

import { render } from '~test';

describe('Home / Editor / InputCheckbox', () => {
  beforeEach(() => {
    render(<InputCheckbox {...props} />);
  });

  it('должен отображать содержимое', () => {
    expect(screen.queryByText(props.label)).toBeInTheDocument();
    expect(screen.queryByTestId(props.name)).toBeInTheDocument();
  });

  it('должен обрабатывать событие изменения', () => {
    const checkbox = screen.queryByTestId(props.name);
    fireEvent.click(checkbox);
    expect(props.onChange).toBeCalled();
  });
});
