import React, { useState } from "react";

import { Container, Group, Controls, Label, Value } from "./styled";

type Props = {
  label: string;
  name: string;
  defaultValue: number;
  tooltip?: string;
  min: number;
  max: number;
  step?: number;
  onChange?: (name: string, value: number) => void;
};

export const InputRange: React.FC<Props> = ({
  label,
  name,
  defaultValue,
  min,
  max,
  step = 1,
  tooltip,
  onChange,
}) => {
  const [value, setValue] = useState<number>(defaultValue);

  const changeValue = (shift: 1 | -1) => {
    const newValue = value + shift * step;

    if (newValue >= min && newValue <= max) {
      setValue(newValue);
      onChange?.(name, newValue);
    }
  };

  return (
    <Container title={tooltip}>
      <Label>{label}</Label>
      <Group>
        <Controls data-testid={name}>
          <Controls.Dec
            onClick={() => changeValue(-1)}
            data-testid={`${name}/dec`}
          />
          <Value small={max >= 10}>{value}</Value>
          <Controls.Inc
            onClick={() => changeValue(+1)}
            data-testid={`${name}/inc`}
          />
        </Controls>
      </Group>
    </Container>
  );
};
