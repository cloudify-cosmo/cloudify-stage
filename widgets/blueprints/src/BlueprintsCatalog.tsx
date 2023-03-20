import BlueprintState from './BlueprintState';
import type { BlueprintsViewProps } from './types';
import BlueprintsCatalogActionButtons from './BlueprintsCatalogActionButtons';

export default function BlueprintsCatalog({
    data,
    fetchData,
    noDataMessage,
    onCreateDeployment,
    onDeleteBlueprint,
    onSelectBlueprint,
    onSetVisibility,
    widget,
    toolbox
}: BlueprintsViewProps) {
    const { DataSegment, Grid, Label, ResourceVisibility, Header } = Stage.Basic;
    const { Blueprints } = Stage.Common;
    const { allowedVisibilitySettings } = Stage.Common.Consts;
    const { TextEllipsis } = Stage.Shared;
    const { GridWrapper } = Stage.Common.Components;
    const manager = toolbox.getManager();
    const { fieldsToShow } = widget.configuration;

    const blueprintsItems = data.items.map(item => {
        const {
            id,
            description,
            created_at: createdAt,
            updated_at: updatedAt,
            created_by: createdBy,
            isSelected,
            visibility: itemVisibility,
            depCount,
            main_file_name: mainFileName
        } = item;

        const handleDeleteBlueprint = () => {
            onDeleteBlueprint(item);
        };

        const handleCreateDeployment = () => {
            onCreateDeployment(item);
        };

        const handleEditInComposer = () => {
            new Stage.Common.Blueprints.Actions(toolbox).doEditInComposer(id, mainFileName);
        };

        return (
            <div key={id} data-testid={id}>
                <DataSegment.Item
                    selected={isSelected}
                    className="fullHeight"
                    onClick={event => {
                        event.stopPropagation();
                        onSelectBlueprint(item);
                    }}
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column>
                                {Blueprints.Actions.isUploaded(item) && (
                                    <Blueprints.UploadedImage
                                        blueprintId={id}
                                        tenantName={manager.getSelectedTenant()}
                                        width={50}
                                    />
                                )}
                                <ResourceVisibility
                                    visibility={itemVisibility}
                                    onSetVisibility={visibility => onSetVisibility(id, visibility)}
                                    allowedSettingTo={allowedVisibilitySettings}
                                    className="rightFloated"
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="bottomDivider">
                            <Grid.Column>
                                <Header
                                    style={{
                                        maxWidth: 'fit-content',
                                        marginLeft: 'unset',
                                        display: 'block'
                                    }}
                                >
                                    <a href="#!" className="breakWord">
                                        {id}
                                    </a>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row title={description}>
                            <Grid.Column>
                                <TextEllipsis>{description}</TextEllipsis>
                            </Grid.Column>
                        </Grid.Row>
                        {fieldsToShow?.includes('Created') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="Created" />
                                </Grid.Column>
                                <Grid.Column width="9">{createdAt}</Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('Updated') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="Updated" />
                                </Grid.Column>
                                <Grid.Column width="9">{updatedAt}</Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('Creator') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="Creator" />
                                </Grid.Column>
                                <Grid.Column width="9">{createdBy}</Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('State') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="State" />
                                </Grid.Column>
                                <Grid.Column width="9">
                                    <BlueprintState blueprint={item} />
                                </Grid.Column>
                            </Grid.Row>
                        )}
                        {fieldsToShow?.includes('Deployments') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" content="# Deployments" />
                                </Grid.Column>
                                <Grid.Column width="9">
                                    <Label color="green" horizontal>
                                        {depCount}
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>
                        )}
                    </Grid>
                    {Blueprints.Actions.isCompleted(item) && (
                        <BlueprintsCatalogActionButtons
                            manager={manager}
                            widget={widget}
                            onCreateDeployment={handleCreateDeployment}
                            onDeleteBlueprint={handleDeleteBlueprint}
                            onEditInComposer={handleEditInComposer}
                            isBlueprintUploaded={Blueprints.Actions.isUploaded(item)}
                        />
                    )}
                </DataSegment.Item>
            </div>
        );
    });

    return (
        <DataSegment
            totalSize={data.total}
            pageSize={widget.configuration.pageSize}
            fetchData={fetchData}
            className="blueprintCatalog"
            searchable
            noDataMessage={noDataMessage}
        >
            <GridWrapper>{blueprintsItems}</GridWrapper>
        </DataSegment>
    );
}
