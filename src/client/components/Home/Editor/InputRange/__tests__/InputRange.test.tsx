import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/InputRangeProps';
import { InputRange } from '../index';

import { render } from '~test';

describe('Home / Editor / InputRange', () => {
  beforeEach(() => {
    render(<InputRange {...props} />);
  });

  it('should display content', () => {
    expect(screen.queryByText(props.label)).toBeInTheDocument();
    expect(screen.queryByTestId(props.name)).toBeInTheDocument();
  });

  it('should handle change event', () => {
    const rangeDec = screen.queryByTestId(`${props.name}/dec`);
    fireEvent.click(rangeDec);
    const rangeInc = screen.queryByTestId(`${props.name}/inc`);
    fireEvent.click(rangeInc);
    expect(props.onChange).toBeCalledTimes(2);
  });
});
