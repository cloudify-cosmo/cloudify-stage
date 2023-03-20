import type Manager from 'app/utils/Manager';
import { translateBlueprints } from './widget.utils';
import type { BlueprintsViewProps } from './types';

const { Grid, Button } = Stage.Basic;
const translate = Stage.Utils.composeT(translateBlueprints, 'buttons');

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
    return (
        <Grid style={{ marginTop: 'auto', paddingTop: '2rem', justifyContent: 'center' }}>
            <Grid.Column style={{ display: 'flex', flexDirection: 'column', width: '280px' }} className="actionButtons">
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
                {isBlueprintUploaded && (
                    <>
                        {!manager.isCommunityEdition() && widget.configuration.showComposerOptions && (
                            <Button
                                icon="external share"
                                content={translate('editInComposer')}
                                onClick={event => {
                                    event.stopPropagation();
                                    onEditInComposer();
                                }}
                            />
                        )}
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
};

export default BlueprintsCatalogActionButtons;
