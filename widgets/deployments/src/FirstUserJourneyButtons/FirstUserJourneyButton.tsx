import styled from 'styled-components';
import { StyledLabel } from './styles';
import ButtonIcon from './ButtonIcon';
import type { ButtonIconProps } from './ButtonIcon';

const { DataSegment, Grid } = Stage.Basic;

const ButtonWrapper = styled.div`
    width: 210px;

    & + & {
        margin-left: 16px;
    }
`;

const StyledGridColumn = styled(Grid.Column)`
    text-align: center;
`;

interface FirstUserJourneyButtonProps extends Omit<ButtonIconProps, 'isTileIcon'> {
    label: string;
    onClick: () => void;
}

const FirstUserJourneyButton = ({ icon, image, label, onClick }: FirstUserJourneyButtonProps) => {
    return (
        <ButtonWrapper>
            <DataSegment.Item onClick={onClick}>
                <Grid>
                    <Grid.Row className="bottomDivider">
                        <StyledGridColumn>
                            <ButtonIcon icon={icon} image={image} />
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

export default FirstUserJourneyButton;
