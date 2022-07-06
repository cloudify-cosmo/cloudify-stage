import styled from 'styled-components';
import FirstUserJourneyButton from './FirstUserJourneyButton';
import { StyledIcon, StyledLabel } from './styles';
import terraformLogo from '../../../../app/images/terraform_logo.png';

const {
    Hooks: { useBoolean },
    Common: { TerraformModal },
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

const { drilldownPage } = Stage.Common.Consts;
const t = getT('widgets.deployments.firstJourney');
const defaultMarketplaceTab = 'Getting Started';

interface FirstUserJourneyButtonsProps {
    toolbox: Stage.Types.Toolbox;
}

const FirstUserJourneyButtons = ({ toolbox }: FirstUserJourneyButtonsProps) => {
    const [isTerraformModalVisible, showTerraformModal, hideTerraformModal] = useBoolean();

    const handleDeploymentsClick = () => {
        const widget = toolbox.getWidget();
        toolbox.drillDown(widget, drilldownPage.blueprintMarketplace, {
            defaultTab: defaultMarketplaceTab
        });
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
                    image={terraformLogo}
                    label={t('buttons.uploadFromTerraform')}
                />
            </RowWrapper>

            {isTerraformModalVisible && <TerraformModal onHide={hideTerraformModal} toolbox={toolbox} />}
        </Wrapper>
    );
};

export default FirstUserJourneyButtons;
