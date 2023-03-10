import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/InputCheckboxProps';
import { InputCheckbox } from '../index';

import { render } from '~test';

describe('Home / Editor / InputCheckbox', () => {
  beforeEach(() => {
    render(<InputCheckbox {...props} />);
  });

  it('should display content', () => {
    expect(screen.queryByText(props.label)).toBeInTheDocument();
    expect(screen.queryByTestId(props.name)).toBeInTheDocument();
  });

  it('should handle change event', () => {
    const checkbox = screen.queryByTestId(props.name);

    fireEvent.click(checkbox);
    expect(props.onChange).toBeCalled();
  });
});
