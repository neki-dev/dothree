import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import render from '~test/render';

import Button from '../index';
import props from '../__mocks__/ButtonProps';

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
