import React, { useState } from 'react';
import {
  Container, Group, Controls, Label, Value,
} from './styled';

type ComponentProps = {
  label: string
  name: string
  defaultValue: number
  tooltip?: string
  min: number
  max: number
  step?: number
  onChange: Function
};

export default function InputRange({
  label, name, defaultValue, min, max, step, tooltip, onChange,
}: ComponentProps) {
  const [value, setValue] = useState<number>(defaultValue);

  const changeValue = (shift: 1 | -1) => {
    const newValue = value + (shift * step);
    if (newValue >= min && newValue <= max) {
      setValue(newValue);
      if (onChange) {
        onChange(name, newValue);
      }
    }
  };

  return (
    <Container title={tooltip}>
      <Label>{label}</Label>
      <Group>
        <Controls>
          <Controls.Dec onClick={() => changeValue(-1)} />
          <Value small={max >= 10}>{value}</Value>
          <Controls.Inc onClick={() => changeValue(1)} />
        </Controls>
      </Group>
    </Container>
  );
}

InputRange.defaultProps = {
  tooltip: undefined,
  step: 1,
};
