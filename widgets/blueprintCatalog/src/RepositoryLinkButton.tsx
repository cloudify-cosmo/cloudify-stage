import type { SemanticICONS } from 'semantic-ui-react';
import styled from 'styled-components';
import Utils from './utils';
import type { BlueprintCatalogWidgetConfiguration } from './types';

interface RepositoryLinkButtonProps {
    url: string;
    displayStyle: BlueprintCatalogWidgetConfiguration['displayStyle'];
}
const { Button, Icon } = Stage.Basic;

const StyledLinkButton = styled(Button)`
    &&&& {
        padding: 0;
        margin-right: 10px;
        font-size: 22px;
        background: none;
        &:hover {
            color: #1b1f23;
        }
    }
`;

const translate = Utils.getWidgetTranslation('blueprintCatalog');

const getIcon = (url: string): SemanticICONS => {
    const isGithub = url.startsWith('https://github.com');
    const isGitlab = url.startsWith('https://gitlab.com');
    const isBitbucket = url.startsWith('https://bitbucket.org');

    if (isGithub) return 'github';
    if (isBitbucket) return 'bitbucket';
    if (isGitlab) return 'gitlab';
    return 'git';
};

const RepositoryLinkButton = ({ url, displayStyle }: RepositoryLinkButtonProps) => {
    const icon = getIcon(url);

    return displayStyle === 'catalog' ? (
        <StyledLinkButton
            circular
            icon={icon}
            onClick={() => Stage.Utils.Url.redirectToPage(url)}
            title={translate('actions.openBlueprintRepository')}
        />
    ) : (
        <Icon
            name={icon as SemanticICONS}
            onClick={() => Stage.Utils.Url.redirectToPage(url)}
            title={translate('actions.openBlueprintRepository')}
        />
    );
};

export default RepositoryLinkButton;
