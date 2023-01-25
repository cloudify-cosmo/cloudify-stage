import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';

const RightAlignedDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    && > * {
        margin-left: 15px;
    }
`;

const IconButtonsGroup: FunctionComponent = ({ children }) => {
    return children ? <RightAlignedDiv>{children}</RightAlignedDiv> : null;
};

export default IconButtonsGroup;
