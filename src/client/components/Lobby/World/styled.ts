import styled from 'styled-components';

const Field = styled.div`
    user-select: none;
    display: flex;
    background: rgba(50, 58, 69, 0.8);
    padding: 10px (10px + 14px) 10px 10px;
    flex-direction: column;
    box-shadow: (-17px - 14px) 0 0 #1E232A inset;
    overflow-y: scroll;
`;

const Line = styled.div`
    display: flex;
`;

export {Field, Line};