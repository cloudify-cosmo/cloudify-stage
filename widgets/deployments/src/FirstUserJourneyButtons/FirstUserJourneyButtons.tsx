import styled from 'styled-components';
import { FirstUserJourneyButton } from './FirstUserJourneyButton';
import { FunctionComponent } from 'react';
import { WidgetlessToolbox } from '../../../../app/utils/StageAPI';
import { MARKETPLACE_TABS } from './consts';

const Wrapper = styled.div`
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
`;

const RowWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const {
    Hooks: { useBoolean },
    Common: { BlueprintMarketplace, TerraformModal },
    Utils: { getT }
} = Stage;

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
            <RowWrapper>{t('header')}</RowWrapper>
            <RowWrapper>
                <FirstUserJourneyButton onClick={handleDeploymentsClick}>
                    {t('buttons.createDeployment')}
                </FirstUserJourneyButton>
                <FirstUserJourneyButton onClick={handleTerraformClick}>
                    {t('buttons.uploadFromTerraform')}
                </FirstUserJourneyButton>
            </RowWrapper>

            {isMarketplaceModalVisible && (
                <BlueprintMarketplace.Modal open onHide={hideMarketplaceModal} tabs={MARKETPLACE_TABS} />
            )}

            {isTerraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />}
        </Wrapper>
    );
};
