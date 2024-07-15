import React from "react";

import { Container, Checkbox, Label } from "./styled";

type Props = {
  label: string;
  name: string;
  tooltip?: string;
  value?: boolean;
  onChange?: (name: string, value: boolean) => void;
};

export const InputCheckbox: React.FC<Props> = ({
  label,
  value,
  name,
  tooltip,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.name, e.target.checked);
  };

  return (
    <Container title={tooltip}>
      <Checkbox
        defaultChecked={value}
        name={name}
        onChange={handleChange}
        data-testid={name}
      />
      <Label>{label}</Label>
    </Container>
  );
};
