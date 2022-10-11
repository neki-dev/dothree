import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import props from '../__mocks__/ButtonProps';
import { Button } from '../index';

import { render } from '~test';

describe('Home / Button', () => {
  beforeEach(() => {
    render(<Button {...props} />);
  });

  it('должен отображать содержимое', () => {
    expect(screen.queryByText(props.children)).toBeInTheDocument();
  });

  it('должен обрабатывать событие клика', () => {
    const button = screen.queryByTestId(props.name);
    fireEvent.click(button);
    expect(props.onClick).toBeCalled();
  });
});
