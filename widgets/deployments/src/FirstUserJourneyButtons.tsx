import styled from 'styled-components';
import { FirstUserJourneyButton } from './FirstUserJourneyButton';
import type { MarketplaceTab } from '../../common/src/blueprintMarketplace/types';
import { FunctionComponent } from 'react';
import { WidgetlessToolbox } from '../../../app/utils/StageAPI';

const Wrapper = styled.div`
    margin: 0 auto;
`;

const {
    Hooks: { useBoolean },
    Common: { BlueprintMarketplace, TerraformModal }
} = Stage;

const defaultTabs: MarketplaceTab[] = [
    {
        name: 'AWS',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/aws_services.json'
    },
    {
        name: 'Azure',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/azure_services.json'
    },
    {
        name: 'GCP',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/gcp_services.json'
    },
    {
        name: 'Terraform',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/terraform_services.json'
    },
    {
        name: 'Helm',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/helm_services.json'
    },
    {
        name: 'Other',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/other_services.json'
    }
];

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
            <FirstUserJourneyButton onClick={handleDeploymentsClick}>Create new Deployment</FirstUserJourneyButton>
            <FirstUserJourneyButton onClick={handleTerraformClick}>Upload from Terraform</FirstUserJourneyButton>

            {isMarketplaceModalVisible && (
                <BlueprintMarketplace.Modal open onHide={hideMarketplaceModal} tabs={defaultTabs} />
            )}

            {isTerraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />}
        </Wrapper>
    );
};
