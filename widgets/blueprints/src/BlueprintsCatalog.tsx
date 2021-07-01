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
    const { DataSegment, Grid, Image, Button, Label, ResourceVisibility, Header } = Stage.Basic;
    const { BlueprintActions } = Stage.Common;
    const manager = toolbox.getManager();

    const blueprintsItems = data.items.map(item => {
        return (
            <Grid.Column key={item.id}>
                <DataSegment.Item
                    selected={item.isSelected}
                    className={`fullHeight ${item.id}`}
                    onClick={event => {
                        event.stopPropagation();
                        onSelectBlueprint(item);
                    }}
                >
                    <Grid>
                        <Grid.Row className="bottomDivider">
                            <Grid.Column width="16">
                                <Image src={Stage.Utils.Url.url(`/ba/image/${item.id}`)} />
                                <Header>
                                    <a href="#!" className="breakWord">
                                        {item.id}
                                    </a>
                                </Header>
                                <ResourceVisibility
                                    visibility={item.visibility}
                                    onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                                    allowedSettingTo={['tenant', 'global']}
                                    className="rightFloated"
                                />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Column width="16">{item.description}</Grid.Column>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="7">
                                <Header as="h5" icon textAlign="left">
                                    Created
                                </Header>
                            </Grid.Column>
                            <Grid.Column width="9">{item.created_at}</Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="7">
                                <Header as="h5" icon textAlign="left">
                                    Updated
                                </Header>
                            </Grid.Column>
                            <Grid.Column width="9">{item.updated_at}</Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="7">
                                <Header as="h5" icon textAlign="left">
                                    Creator
                                </Header>
                            </Grid.Column>
                            <Grid.Column width="9">{item.created_by}</Grid.Column>
                        </Grid.Row>

                        <Grid.Row className="noPadded">
                            <Grid.Column width="7">
                                <Header as="h5" icon textAlign="left">
                                    Main Blueprint File
                                </Header>
                            </Grid.Column>
                            <Grid.Column width="9">{item.main_file_name}</Grid.Column>
                        </Grid.Row>

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
                    </Grid>

                    <Grid.Column width="16">
                        <div style={{ height: '80px' }} />
                    </Grid.Column>
                </DataSegment.Item>

                {BlueprintActions.isCompleted(item) && (
                    <div className="actionButtons">
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
                        {BlueprintActions.isUploaded(item) && (
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

                                {!manager.isCommunityEdition() && widget.configuration.showEditCopyInComposerButton && (
                                    <Button
                                        icon="external share"
                                        content="Edit a copy in Composer"
                                        labelPosition="left"
                                        onClick={event => {
                                            event.stopPropagation();
                                            new Stage.Common.BlueprintActions(toolbox).doEditInComposer(
                                                item.id,
                                                item.main_file_name
                                            );
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}
            </Grid.Column>
        );
    });

    const blueprintsRows = [];
    let row: ReactElement[] = [];
    _.each(blueprintsItems, (blueprintItem, index) => {
        row.push(blueprintItem);
        if ((index + 1) % 3 === 0) {
            blueprintsRows.push(
                <div key={blueprintsRows.length + 1} className="three column row">
                    {row}
                </div>
            );
            row = [];
        }
    });
    if (row.length > 0) {
        blueprintsRows.push(
            <div key={blueprintsRows.length + 1} className="three column row">
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
                <Grid>{blueprintsRows}</Grid>
            </DataSegment>
        </div>
    );
}
