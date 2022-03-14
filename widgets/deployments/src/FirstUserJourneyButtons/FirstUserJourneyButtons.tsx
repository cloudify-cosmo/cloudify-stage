import styled from 'styled-components';
import { FirstUserJourneyButton } from './FirstUserJourneyButton';
import { FunctionComponent } from 'react';
import { WidgetlessToolbox } from '../../../../app/utils/StageAPI';
import { MARKETPLACE_TABS } from './consts';

const Wrapper = styled.div`
    margin: 0 auto;
`;

const RowWrapper = styled.div`
    align-items: center;
`;

const {
    Hooks: { useBoolean },
    Common: { BlueprintMarketplace, TerraformModal }
} = Stage;

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
            <RowWrapper>No Deployments Yet</RowWrapper>
            <RowWrapper>
                <FirstUserJourneyButton onClick={handleDeploymentsClick}>Create new Deployment</FirstUserJourneyButton>
                <FirstUserJourneyButton onClick={handleTerraformClick}>Upload from Terraform</FirstUserJourneyButton>
            </RowWrapper>

            {isMarketplaceModalVisible && (
                <BlueprintMarketplace.Modal open onHide={hideMarketplaceModal} tabs={MARKETPLACE_TABS} />
            )}

            {isTerraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />}
        </Wrapper>
    );
};
