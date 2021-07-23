import styled from 'styled-components';

import IconPlayers from './icons/players.svg';

const Title = styled.div`
  text-align: center;
  margin: 20px 0;
  color: #46515e;
  font-size: 11px;
`;

const DataGroup = styled.div`
  display: flex;
  align-items: center;
`;

const LobbyList = styled.div`
  width: 210px;
`;

const Lobby: any = styled.a`
  display: flex;
  background: #11181f;
  padding: 15px;
  border-radius: 3px;
  text-decoration: none;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 30px rgba(#000, 0.05);
  transition: all 0.1s ease-out;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  &:hover {
    background: #222c38;
  }
`;

Lobby.OnlineWrapper = styled.span`
  display: inline-block;
  color: #5a6a7d;
  padding-right: 24px;
  background: url(${IconPlayers}) right 0 no-repeat;
  background-size: 14px;
  white-space: nowrap;
`;

Lobby.OnlineValue = styled.span`
  color: #8aa0ba;
  font-weight: bold;
`;

Lobby.Date = styled.span`
  display: inline-block;
  margin-right: 9px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  border-right: 1px solid rgba(#fff, 0.1);
  padding-right: 8px;
`;

Lobby.Name = styled.span`
  display: inline-block;
  color: #fff;
  font-size: 15px;
  margin-right: 20px;
`;

export {Title, LobbyList, Lobby, DataGroup};