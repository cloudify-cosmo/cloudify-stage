import styled from 'styled-components';

const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 3fr));
    grid-gap: 20px;
    margin-bottom: 1rem;
`;

export default GridWrapper;
