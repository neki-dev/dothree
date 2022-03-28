import React from 'react';
import { Container, Checkbox, Label } from './styled';

type ComponentProps = {
  label: string
  name: string
  tooltip?: string
  value: boolean
  onChange: Function
};

export default function InputCheckbox({
  label, value, name, tooltip, onChange,
}: ComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.checked);
  };

  return (
    <Container title={tooltip}>
      <Checkbox defaultChecked={value} name={name} onChange={handleChange} />
      <Label>{label}</Label>
    </Container>
  );
}

InputCheckbox.defaultProps = {
  tooltip: undefined,
};
