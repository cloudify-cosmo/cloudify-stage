import { FunctionComponent } from 'react';
import type { SemanticICONS } from 'semantic-ui-react';
import styled from 'styled-components';
import { StyledLabel } from './styles';
import { ButtonIcon } from './ButtonIcon';

const { DataSegment, Grid } = Stage.Basic;

const ButtonWrapper = styled.div`
    width: 210px;
    height: 190px;

    & + & {
        margin-left: 16px;
    }
`;

const StyledGridColumn = styled(Grid.Column)`
    text-align: center;
`;

interface Props {
    icon: SemanticICONS;
    label: string;
    onClick: () => void;
}

export const FirstUserJourneyButton: FunctionComponent<Props> = ({ icon, label, onClick }) => {
    return (
        <ButtonWrapper>
            <DataSegment.Item onClick={onClick}>
                <Grid>
                    <Grid.Row className="bottomDivider">
                        <StyledGridColumn>
                            <ButtonIcon icon={icon} />
                        </StyledGridColumn>
                    </Grid.Row>
                    <Grid.Row>
                        <StyledGridColumn>
                            <StyledLabel>{label}</StyledLabel>
                        </StyledGridColumn>
                    </Grid.Row>
                </Grid>
            </DataSegment.Item>
        </ButtonWrapper>
    );
};
