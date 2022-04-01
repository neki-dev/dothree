import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import render from '~test/render';

import InputRange from '../index';
import props from '../__mocks__/InputRangeProps';

describe('Home / Editor / InputRange', () => {
  beforeEach(() => {
    render(<InputRange {...props} />);
  });

  it('должен отображать содержимое', () => {
    expect(screen.queryByText(props.label)).toBeInTheDocument();
    expect(screen.queryByTestId(props.name)).toBeInTheDocument();
  });

  it('должен обрабатывать события изменения', () => {
    const rangeDec = screen.queryByTestId(`${props.name}/dec`);
    fireEvent.click(rangeDec);
    const rangeInc = screen.queryByTestId(`${props.name}/inc`);
    fireEvent.click(rangeInc);
    expect(props.onChange).toBeCalledTimes(2);
  });
});
