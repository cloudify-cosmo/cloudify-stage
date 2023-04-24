import styled from 'styled-components';
import type Manager from 'app/utils/Manager';
import type { ManagerData } from 'app/reducers/managerReducer';
import { translateBlueprints } from './widget.utils';
import type { BlueprintsViewProps } from './types';

const { Grid, Button } = Stage.Basic;
const translate = Stage.Utils.composeT(translateBlueprints, 'buttons');

const ActionButtonWrapper = styled(Grid.Column)`
    display: flex;
    flex-direction: column;
    width: 280px;
`;

const ButtonsWrapper = styled.div`
    display: flex;
`;

export interface BlueprintsCatalogActionButtonsProps {
    isBlueprintUploaded: boolean;
    widget: BlueprintsViewProps['widget'];
    manager: Manager;
    managerData: ManagerData;
    onCreateDeployment: () => void;
    onDeleteBlueprint: () => void;
    onEditInComposer: () => void;
}

const BlueprintsCatalogActionButtons = ({
    isBlueprintUploaded,
    widget,
    manager,
    managerData,
    onCreateDeployment,
    onDeleteBlueprint,
    onEditInComposer
}: BlueprintsCatalogActionButtonsProps) => {
    const { hasComposerPermission } = Stage.Utils;

    const showEditInComposerButton =
        isBlueprintUploaded &&
        hasComposerPermission(managerData) &&
        !manager.isCommunityEdition() &&
        widget.configuration.showComposerOptions;

    return (
        <ActionButtonWrapper className="actionButtons">
            <ButtonsWrapper>
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
            </ButtonsWrapper>
            {showEditInComposerButton && (
                <ButtonsWrapper>
                    <Button
                        icon="external share"
                        content={translate('editInComposer')}
                        onClick={event => {
                            event.stopPropagation();
                            onEditInComposer();
                        }}
                        style={{ flex: 1 }}
                    />
                </ButtonsWrapper>
            )}
        </ActionButtonWrapper>
    );
};

export default BlueprintsCatalogActionButtons;
