import styled from 'styled-components';
import FirstUserJourneyButton from './FirstUserJourneyButton';
import { MARKETPLACE_TABS } from './consts';
import { StyledIcon, StyledLabel } from './styles';

const {
    Hooks: { useBoolean },
    Common: { BlueprintMarketplace, TerraformModal },
    Utils: { getT },
    Basic: { Grid }
} = Stage;

const Wrapper = styled.div`
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
`;

const RowWrapper = styled.div`
    display: flex;
    align-items: center;

    & + & {
        margin-top: 32px;
    }
`;

const StyledColumn = styled(Grid.Column)`
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const IconWrapper = styled.div`
    padding: 12px 0;
`;

const t = getT('widgets.deployments.firstJourney');

interface FirstUserJourneyButtonsProps {
    toolbox: Stage.Types.WidgetlessToolbox;
}

const FirstUserJourneyButtons = ({ toolbox }: FirstUserJourneyButtonsProps) => {
    const [isMarketplaceModalVisible, showMarketplaceModal, hideMarketplaceModal] = useBoolean();
    const [isTerraformModalVisible, showTerraformModal, hideTerraformModal] = useBoolean();

    const handleDeploymentsClick = () => {
        showMarketplaceModal();
    };

    const handleTerraformClick = () => {
        showTerraformModal();
    };

    return (
        <Wrapper>
            <RowWrapper>
                <StyledColumn>
                    <IconWrapper>
                        <StyledIcon name="home" />
                    </IconWrapper>
                    <StyledLabel>{t('header')}</StyledLabel>
                </StyledColumn>
            </RowWrapper>
            <RowWrapper>
                <FirstUserJourneyButton
                    onClick={handleDeploymentsClick}
                    icon="rocket"
                    label={t('buttons.createDeployment')}
                />
                <FirstUserJourneyButton
                    onClick={handleTerraformClick}
                    // NOTE: Functionality for terraform image has been implemented, but for now we don't have this image.
                    // It should be availble in the next week, untill this time we were instructed to use the rocket icon
                    icon="rocket"
                    label={t('buttons.uploadFromTerraform')}
                />
            </RowWrapper>

            {isMarketplaceModalVisible && (
                <BlueprintMarketplace.Modal open onHide={hideMarketplaceModal} tabs={MARKETPLACE_TABS} />
            )}

            {isTerraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />}
        </Wrapper>
    );
};

export default FirstUserJourneyButtons;
