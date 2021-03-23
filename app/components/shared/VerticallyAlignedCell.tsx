import styled from 'styled-components';

const VerticallyAlignedCell = styled.div`
    td & {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

export default VerticallyAlignedCell;
