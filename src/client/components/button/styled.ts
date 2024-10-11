import styled from "styled-components";

export const Container = styled.button.attrs({
  tabIndex: 1,
})`
  width: 100%;
  text-align: center;
  border: none;
  color: #fff;
  background: #ff5d00;
  padding: 18px;
  border-radius: 3px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background-color 0.1s ease-in;
  &:hover,
  &:focus {
    cursor: pointer;
    background: #684473;
  }
`;
