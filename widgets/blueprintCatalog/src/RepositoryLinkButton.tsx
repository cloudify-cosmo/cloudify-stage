import styled from 'styled-components';
import Utils from './utils';

interface IconLinkProps {
    url: string;
    displayStyle: string;
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

const t = Utils.getWidgetTranslation('blueprintCatalog');

const getIcon = (url: string): string => {
    const isGithub = url.startsWith('https://github.com');
    const isGitlab = url.startsWith('https://gitlab.com');
    const isBitbucket = url.startsWith('https://bitbucket.org');

    if (isGithub) return 'github';
    if (isBitbucket) return 'bitbucket';
    if (isGitlab) return 'gitlab';
    return 'git';
};

const RepositoryLinkButton = ({ url, displayStyle }: IconLinkProps) => {
    const icon = getIcon(url);

    return displayStyle === 'catalog' ? (
        <StyledLinkButton
            circular
            icon={icon}
            onClick={() => Stage.Utils.Url.redirectToPage(url)}
            title={t('actions.openBlueprintRepository')}
            bordered
        />
    ) : (
        <Icon
            name="github"
            bordered
            onClick={() => Stage.Utils.Url.redirectToPage(url)}
            title={t('actions.openBlueprintRepository')}
        />
    );
};

export default RepositoryLinkButton;
