import { screen, waitFor } from "@testing-library/react";
import React from "react";

import props from "../__mocks__/CountdownProps";
import { Countdown } from "../index";

import { render, socket } from "~/../tools/test";

describe("Lobby / Info / Countdown", () => {
  beforeEach(() => {
    render(<Countdown {...props} />, {
      socket: true,
    });
  });

  it("should not display, if seconds equal to zero", () => {
    expect(screen.queryByText("00:00")).not.toBeInTheDocument();
  });

  it("should display, if seconds more zero", () => {
    socket.emitSelf("updateTimeout", 60);

    waitFor(() => {
      expect(screen.queryByText("60:00")).toBeInTheDocument();
    });
  });
});
