import styled from 'styled-components';
import { FirstUserJourneyButton } from './FirstUserJourneyButton';
import { FunctionComponent } from 'react';
import { WidgetlessToolbox } from '../../../../app/utils/StageAPI';
import { MARKETPLACE_TABS } from './consts';
import { StyledLabel } from './styles';
import { ButtonIcon } from './ButtonIcon';

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

const t = getT('widgets.deployments.firstJourney');

interface Props {
    toolbox: WidgetlessToolbox;
}

export const FirstUserJourneyButtons: FunctionComponent<Props> = ({ toolbox }) => {
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
                    <ButtonIcon icon="home" />
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
                    icon="teletype"
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
