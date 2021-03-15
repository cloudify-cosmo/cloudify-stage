import styled from 'styled-components';

declare global {
    namespace Stage {
        interface Common {
            VerticallyAlignedCell: typeof VerticallyAlignedCell;
        }
    }
}

const VerticallyAlignedCell = styled.div`
    td & {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

Stage.defineCommon({
    name: 'VerticallyAlignedCell',
    common: VerticallyAlignedCell
});
