import styled from 'styled-components';
import type Manager from 'app/utils/Manager';
import { translateBlueprints } from './widget.utils';
import type { BlueprintsViewProps } from './types';

const { Grid, Button } = Stage.Basic;
const translate = Stage.Utils.composeT(translateBlueprints, 'buttons');

const ActionButtonWrapper = styled(Grid.Column)`
    display: flex;
    flex-direction: column;
    width: 280px;
`;

export interface BlueprintsCatalogActionButtonsProps {
    isBlueprintUploaded: boolean;
    widget: BlueprintsViewProps['widget'];
    manager: Manager;
    onCreateDeployment: () => void;
    onDeleteBlueprint: () => void;
    onEditInComposer: () => void;
}

const BlueprintsCatalogActionButtons = ({
    isBlueprintUploaded,
    widget,
    manager,
    onCreateDeployment,
    onDeleteBlueprint,
    onEditInComposer
}: BlueprintsCatalogActionButtonsProps) => {
    const showEditInComposerButton =
        isBlueprintUploaded && !manager.isCommunityEdition() && widget.configuration.showComposerOptions;

    return (
        <ActionButtonWrapper className="actionButtons">
            <div style={{ display: 'flex' }}>
                <Button
                    icon="trash"
                    content={translate('delete')}
                    basic
                    onClick={event => {
                        event.stopPropagation();
                        onDeleteBlueprint();
                    }}
                    style={{ flex: 1 }}
                />
                {isBlueprintUploaded && (
                    <>
                        <Button
                            icon="rocket"
                            content={translate('deploy')}
                            onClick={event => {
                                event.stopPropagation();
                                onCreateDeployment();
                            }}
                            style={{ flex: 1 }}
                        />
                    </>
                )}
            </div>
            {showEditInComposerButton && (
                <Button
                    icon="external share"
                    content={translate('editInComposer')}
                    onClick={event => {
                        event.stopPropagation();
                        onEditInComposer();
                    }}
                />
            )}
        </ActionButtonWrapper>
    );
};

export default BlueprintsCatalogActionButtons;
