import { fireEvent, screen } from "@testing-library/react";
import React from "react";

import props from "../__mocks__/ButtonProps";
import { Button } from "../index";

import { render } from "~/../../tools/test";

describe("Home / Button", () => {
  beforeEach(() => {
    render(<Button {...props} />);
  });

  it("should display content", () => {
    expect(screen.queryByText(props.children)).toBeInTheDocument();
  });

  it("should handle click event", () => {
    const button = screen.queryByTestId(props.name);

    if (button) {
      fireEvent.click(button);
    }

    expect(props.onClick).toBeCalled();
  });
});
