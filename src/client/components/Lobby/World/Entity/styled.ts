import styled, {css} from 'styled-components';

import IconBonusLaser from './icons/laser.svg';
import IconBonusSpawn from './icons/spawn.svg';
import IconBonusReplacer from './icons/replacer.svg';

const Pointer = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  transition: all 0.2s ease-out;

  &:after {
    position: absolute;
    content: '';
    width: 6px;
    height: 6px;
    left: 50%;
    top: 50%;
    margin: -3px 0 0 -3px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const Block: any = styled.div<{
    types: string[]
    allow: boolean
}>`
  position: relative;
  margin: 1px;
  border-radius: 8%;
  flex: 1;
  ${(p) => {
        if (p.types[0] === 'empty') {
            return css`background: rgba(255, 255, 255, 0.04);`;
        } else if (p.types[0] === 'block') {
            return css`background: linear-gradient(135deg, rgba(41, 52, 64, 1) 0%, rgba(10, 19, 29, 1) 100%);`;
        } else if (p.types[0] === 'player') {
            switch (Number(p.types[1].replace('slot', '')) - 1) {
                case 0: return css`background: linear-gradient(135deg, #ffb300 0%, #ff7300 100%);`;
                case 1: return css`background: linear-gradient(135deg, #e47dff 0%, #9248a6 100%);`;
                case 2: return css`background: linear-gradient(135deg, #3dcbf0 0%, #1b86a2 100%);`;
                case 3: return css`background: linear-gradient(135deg, #f05656 0%, #b53a3a 100%);`;
                case 4: return css`background: linear-gradient(135deg, #a3e75f 0%, #5ea21b 100%);`;
            }
        } else if (p.types[0] === 'bonus') {
            return css`
                background-color: #131314;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 50%;
                background-image: ${(() => {
                    switch (p.types[1]) {
                        case 'spawn':
                            return `url(${IconBonusSpawn})`;
                        case 'laser':
                            return `url(${IconBonusLaser})`;
                        case 'replacer':
                            return `url(${IconBonusReplacer})`;
                        default:
                            return 'none';
                    }
                })()};
            `;
        }
    }}
  
  ${(p) => p.allow && css`
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover {
          cursor: pointer;

          > ${Pointer} {
              background-color: rgba(255, 255, 255, 0.06);
              width: 100%;
              height: 100%;
              border-radius: 8%;
          }
      }
  `};
    
  ${(p) => p.types.includes('win') && css`
      &::after {
          position: absolute;
          content: '';
          width: 20%;
          height: 20%;
          left: 50%;
          top: 50%;
          margin: -10% 0 0 -10%;
          border-radius: 50%;
          background-color: #fff;
      }
  `};

  &::before {
    content: '';
    width: 100%;
    padding-top: 100%;
    float: left;
  }
`;

export {Block, Pointer};