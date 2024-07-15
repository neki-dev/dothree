import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  padding: 13px 14px;
  border-radius: 4px;
  &:not(:last-child) {
    margin-bottom: 3px;
  }
`;

export const Checkbox: any = styled.input.attrs({
  type: "checkbox",
  tabIndex: 1,
})`
  margin-right: 10px;
  height: 14px;
  width: 14px;
`;

export const Label = styled.div`
  color: #bac7d6;
  line-height: 14px;
  font-size: 12px;
`;
