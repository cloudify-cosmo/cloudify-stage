import type { ReactElement } from 'react';

import BlueprintState from './BlueprintState';
import type { BlueprintsViewProps } from './types';

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
    const { DataSegment, Grid, Button, Label, ResourceVisibility, Header } = Stage.Basic;
    const { Blueprints } = Stage.Common;
    const { allowedVisibilitySettings } = Stage.Common.Consts;
    const manager = toolbox.getManager();
    const { fieldsToShow } = widget.configuration;

    const blueprintsItems = data.items.map(item => {
        return (
            <Grid.Column key={item.id} data-testid={item.id}>
                <DataSegment.Item
                    selected={item.isSelected}
                    className="fullHeight"
                    onClick={event => {
                        event.stopPropagation();
                        onSelectBlueprint(item);
                    }}
                >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width="16">
                                {Blueprints.Actions.isUploaded(item) && (
                                    <Blueprints.UploadedImage
                                        blueprintId={item.id}
                                        tenantName={manager.getSelectedTenant()}
                                        width={50}
                                    />
                                )}
                                <ResourceVisibility
                                    visibility={item.visibility}
                                    onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                                    allowedSettingTo={allowedVisibilitySettings}
                                    className="rightFloated"
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="bottomDivider">
                            <Grid.Column width="16">
                                <Header
                                    style={{
                                        maxWidth: 'fit-content',
                                        marginLeft: 'unset',
                                        display: 'block'
                                    }}
                                >
                                    <a href="#!" className="breakWord">
                                        {item.id}
                                    </a>
                                </Header>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Column
                            width="16"
                            style={{
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                maxWidth: 400
                            }}
                            title={item.description}
                        >
                            {item.description}
                        </Grid.Column>

                        {fieldsToShow?.includes('Created') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" icon textAlign="left">
                                        Created
                                    </Header>
                                </Grid.Column>
                                <Grid.Column width="9">{item.created_at}</Grid.Column>
                            </Grid.Row>
                        )}

                        {fieldsToShow?.includes('Updated') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" icon textAlign="left">
                                        Updated
                                    </Header>
                                </Grid.Column>
                                <Grid.Column width="9">{item.updated_at}</Grid.Column>
                            </Grid.Row>
                        )}

                        {fieldsToShow?.includes('Creator') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" icon textAlign="left">
                                        Creator
                                    </Header>
                                </Grid.Column>
                                <Grid.Column width="9">{item.created_by}</Grid.Column>
                            </Grid.Row>
                        )}

                        {fieldsToShow?.includes('State') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" icon textAlign="left">
                                        State
                                    </Header>
                                </Grid.Column>
                                <Grid.Column width="9">
                                    <BlueprintState blueprint={item} />
                                </Grid.Column>
                            </Grid.Row>
                        )}

                        {fieldsToShow?.includes('Deployments') && (
                            <Grid.Row className="noPadded">
                                <Grid.Column width="7">
                                    <Header as="h5" icon textAlign="left">
                                        # Deployments
                                    </Header>
                                </Grid.Column>
                                <Grid.Column width="9">
                                    <Label color="green" horizontal>
                                        {item.depCount}
                                    </Label>
                                </Grid.Column>
                            </Grid.Row>
                        )}
                    </Grid>
                    {Blueprints.Actions.isCompleted(item) && (
                        <Grid style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                            <Grid.Row centered>
                                <Grid.Column textAlign="center" className="actionButtons">
                                    <Button
                                        icon="trash"
                                        content="Delete"
                                        basic
                                        labelPosition="left"
                                        onClick={event => {
                                            event.stopPropagation();
                                            onDeleteBlueprint(item);
                                        }}
                                    />
                                    {Blueprints.Actions.isUploaded(item) && (
                                        <>
                                            <Button
                                                icon="rocket"
                                                content="Deploy"
                                                labelPosition="left"
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    onCreateDeployment(item);
                                                }}
                                            />

                                            {!manager.isCommunityEdition() && widget.configuration.showComposerOptions && (
                                                <Button
                                                    icon="external share"
                                                    content="Edit a copy in Composer"
                                                    labelPosition="left"
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        new Stage.Common.Blueprints.Actions(toolbox).doEditInComposer(
                                                            item.id,
                                                            item.main_file_name
                                                        );
                                                    }}
                                                    style={{ width: '247px' }}
                                                />
                                            )}
                                        </>
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    )}
                </DataSegment.Item>
            </Grid.Column>
        );
    });

    const blueprintsRows = [];
    let row: ReactElement[] = [];
    _.each(blueprintsItems, (blueprintItem, index) => {
        row.push(blueprintItem);
        if ((index + 1) % 5 === 0) {
            blueprintsRows.push(
                <div key={blueprintsRows.length + 1} className="five column row">
                    {row}
                </div>
            );
            row = [];
        }
    });
    if (row.length > 0) {
        blueprintsRows.push(
            <div key={blueprintsRows.length + 1} className="five column row">
                {row}
            </div>
        );
    }

    return (
        <div>
            <DataSegment
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                fetchData={fetchData}
                className="blueprintCatalog"
                searchable
                noDataMessage={noDataMessage}
            >
                <Grid stackable>{blueprintsRows}</Grid>
            </DataSegment>
        </div>
    );
}
